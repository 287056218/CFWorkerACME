/**
 * 迷你 ZIP 打包器（仅支持 STORED / 无压缩模式）
 * -------------------------------------------------------------------------
 * Cloudflare Worker 下常用的 archiver 依赖 Node Streams 无法使用；
 * 证书文件体积极小，使用 stored 模式已足够。
 *
 * 仅实现以下 PKZIP 结构：
 *   - Local File Header (0x04034b50)
 *   - File Data
 *   - Central Directory Header (0x02014b50)
 *   - End of Central Directory Record (0x06054b50)
 *
 * 文件名全部按 UTF-8 编码，并设置 general-purpose-bit flag bit 11。
 */

const LFH_SIG = 0x04034b50;
const CDR_SIG = 0x02014b50;
const EOCD_SIG = 0x06054b50;

export interface ZipEntry {
    path: string;
    content: string | Uint8Array;
}

/** CRC-32 table（预计算） */
const CRC_TABLE: Uint32Array = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        }
        t[i] = c >>> 0;
    }
    return t;
})();

function crc32(buf: Uint8Array): number {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

/** 工具：拼接多个 Uint8Array */
function concat(parts: Uint8Array[]): Uint8Array {
    const total = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const p of parts) {
        out.set(p, off);
        off += p.length;
    }
    return out;
}

function writeU16(v: number): Uint8Array {
    const b = new Uint8Array(2);
    b[0] = v & 0xFF;
    b[1] = (v >>> 8) & 0xFF;
    return b;
}

function writeU32(v: number): Uint8Array {
    const b = new Uint8Array(4);
    b[0] = v & 0xFF;
    b[1] = (v >>> 8) & 0xFF;
    b[2] = (v >>> 16) & 0xFF;
    b[3] = (v >>> 24) & 0xFF;
    return b;
}

/** DOS time/date 当前时间 */
function dosDateTime(d: Date = new Date()): { time: number; date: number } {
    const time =
        ((d.getHours() & 0x1F) << 11) |
        ((d.getMinutes() & 0x3F) << 5) |
        ((Math.floor(d.getSeconds() / 2)) & 0x1F);
    const date =
        (((d.getFullYear() - 1980) & 0x7F) << 9) |
        (((d.getMonth() + 1) & 0x0F) << 5) |
        (d.getDate() & 0x1F);
    return {time, date};
}

/**
 * 构造一个 stored 模式的 ZIP。
 * @param entries 文件列表
 * @returns ZIP 字节流
 */
export async function buildStoredZip(entries: ZipEntry[]): Promise<Uint8Array> {
    const enc = new TextEncoder();
    const {time: dosTime, date: dosDate} = dosDateTime();
    const fileRecords: Uint8Array[] = [];
    const centralDir: Uint8Array[] = [];
    let offset = 0;

    for (const e of entries) {
        const data: Uint8Array = typeof e.content === "string"
            ? enc.encode(e.content)
            : e.content;
        const nameBytes = enc.encode(e.path);
        const crc = crc32(data);
        const size = data.length;

        // Local File Header -------------------------------------------
        // general_purpose bit 11 = UTF-8
        const lfh = concat([
            writeU32(LFH_SIG),
            writeU16(20),                // version needed to extract
            writeU16(0x0800),            // gp flag: UTF-8
            writeU16(0),                 // method = stored
            writeU16(dosTime),
            writeU16(dosDate),
            writeU32(crc),
            writeU32(size),              // compressed size = size
            writeU32(size),              // uncompressed size
            writeU16(nameBytes.length),
            writeU16(0),                 // extra length
            nameBytes,
            data,
        ]);
        fileRecords.push(lfh);

        // Central Directory Header ------------------------------------
        const cdh = concat([
            writeU32(CDR_SIG),
            writeU16(20),                // version made by
            writeU16(20),                // version needed
            writeU16(0x0800),            // gp flag: UTF-8
            writeU16(0),                 // method = stored
            writeU16(dosTime),
            writeU16(dosDate),
            writeU32(crc),
            writeU32(size),
            writeU32(size),
            writeU16(nameBytes.length),
            writeU16(0),                 // extra length
            writeU16(0),                 // comment length
            writeU16(0),                 // disk number
            writeU16(0),                 // internal attrs
            writeU32(0),                 // external attrs
            writeU32(offset),            // local header offset
            nameBytes,
        ]);
        centralDir.push(cdh);
        offset += lfh.length;
    }

    const filesPart = concat(fileRecords);
    const cdrPart = concat(centralDir);

    // End of Central Directory ------------------------------------------
    const eocd = concat([
        writeU32(EOCD_SIG),
        writeU16(0),                     // disk number
        writeU16(0),                     // disk with start of central dir
        writeU16(entries.length),        // records on this disk
        writeU16(entries.length),        // total records
        writeU32(cdrPart.length),
        writeU32(filesPart.length),      // offset of central dir
        writeU16(0),                     // comment length
    ]);

    return concat([filesPart, cdrPart, eocd]);
}
