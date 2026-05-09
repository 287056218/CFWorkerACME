/**
 * 帮助文档页面 /help
 *
 * 纯静态页面，包含"使用教程"和"常见问题"两大板块。
 */
import { Anchor, Card, Collapse, Divider, Tag, Typography } from 'antd';
import {
  BookOpen,
  HelpCircle,
  Lock,
  Globe,
  ShieldCheck,
  FileKey,
  AlertTriangle,
  Server,
} from 'lucide-react';
import PageShell from '@components/Layout/PageShell';
import SectionHeader from '@components/Layout/SectionHeader';
import styles from './Help.module.css';

const { Title, Paragraph, Text } = Typography;

/* ========== 使用教程数据 ========== */

const CA_BRANDS = [
  { name: "Let's Encrypt", desc: '全球最流行的免费 CA，支持 DV 证书，有效期 90 天', color: 'blue' },
  { name: 'ZeroSSL', desc: '免费 DV 证书，支持 REST API，有效期 90 天', color: 'cyan' },
  { name: 'Google Trust Services', desc: 'Google 提供的公共 CA，有效期 90 天', color: 'green' },
  { name: 'Buypass', desc: '挪威 CA，提供免费 DV 证书，有效期 180 天', color: 'purple' },
  { name: 'SSL.com', desc: '商业 CA，提供免费 DV 证书（ACME），有效期 90 天', color: 'orange' },
];

const CERT_TYPES = [
  { name: '单域名证书', desc: '仅保护一个域名，如 example.com' },
  { name: '多域名证书 (SAN)', desc: '一张证书保护多个域名，如 example.com + api.example.com' },
  { name: '通配符证书', desc: '保护某域名下所有子域名，如 *.example.com（需 DNS-01 验证）' },
];

const ALGORITHMS = [
  { name: 'RSA 2048', desc: '兼容性最好，适合大多数场景', tag: '推荐' },
  { name: 'RSA 4096', desc: '更高安全性，但握手性能略低' },
  { name: 'ECC P-256', desc: '密钥更短、性能更优，现代浏览器均支持', tag: '推荐' },
  { name: 'ECC P-384', desc: '更高安全级别的椭圆曲线算法' },
];

/* ========== 常见问题数据 ========== */

const FAQ_CERT = [
  {
    key: 'cert-1',
    label: '免费证书的有效期是多久？',
    children: (
      <Paragraph>
        大多数免费 ACME CA 签发的证书有效期为 <Text strong>90 天</Text>（Buypass 为 180 天）。
        建议在到期前 30 天进行续期。本平台支持自动续期提醒功能。
      </Paragraph>
    ),
  },
  {
    key: 'cert-2',
    label: '如何续期证书？',
    children: (
      <Paragraph>
        证书到期前，您可以在「证书列表」中找到对应证书，点击「续期」按钮重新发起申请。
        域名验证方式与首次申请相同。如果使用 API 接入，可通过定时任务自动续期。
      </Paragraph>
    ),
  },
  {
    key: 'cert-3',
    label: '证书吊销后还能恢复吗？',
    children: (
      <Paragraph>
        <Text type="danger">不能。</Text>证书一旦吊销将无法恢复，需要重新申请新证书。
        请在吊销前确认该证书确实不再使用。
      </Paragraph>
    ),
  },
  {
    key: 'cert-4',
    label: 'DV 证书和 OV/EV 证书有什么区别？',
    children: (
      <Paragraph>
        DV（Domain Validation）证书仅验证域名所有权，签发速度快（分钟级）。
        OV/EV 证书需要验证组织身份，签发周期长。本平台仅支持 DV 证书的自动化签发。
      </Paragraph>
    ),
  },
];

const FAQ_CAA = [
  {
    key: 'caa-1',
    label: '什么是 CAA 记录？',
    children: (
      <Paragraph>
        CAA（Certification Authority Authorization）是一种 DNS 记录类型，用于指定哪些 CA 被授权为该域名签发证书。
        如果域名设置了 CAA 记录但未包含目标 CA，签发将会失败。
      </Paragraph>
    ),
  },
  {
    key: 'caa-2',
    label: '如何配置 CAA 记录？',
    children: (
      <>
        <Paragraph>在域名的 DNS 管理中添加 CAA 记录，格式如下：</Paragraph>
        <div className={styles.highlight}>
          <Text code>example.com. CAA 0 issue "letsencrypt.org"</Text>
          <br />
          <Text code>example.com. CAA 0 issue "sectigo.com"</Text>
          <br />
          <Text code>example.com. CAA 0 issuewild "letsencrypt.org"</Text>
        </div>
        <Paragraph style={{ marginTop: 8 }}>
          <Text type="secondary">
            提示：如果不确定，可以不设置 CAA 记录（默认允许所有 CA 签发）。
          </Text>
        </Paragraph>
      </>
    ),
  },
  {
    key: 'caa-3',
    label: 'CAA 记录导致签发失败怎么办？',
    children: (
      <Paragraph>
        请检查域名的 CAA 记录是否包含了您选择的 CA。例如使用 Let's Encrypt 时，
        需要确保 CAA 记录中包含 <Text code>issue "letsencrypt.org"</Text>。
        如果使用通配符证书，还需要添加 <Text code>issuewild</Text> 记录。
      </Paragraph>
    ),
  },
];

const FAQ_TXT = [
  {
    key: 'txt-1',
    label: '如何添加 TXT 记录进行域名验证？',
    children: (
      <>
        <Paragraph>DNS-01 验证需要您在域名的 DNS 中添加一条 TXT 记录：</Paragraph>
        <div className={styles.highlight}>
          <Text code>_acme-challenge.example.com TXT "xxxxxxxxxxxx"</Text>
        </div>
        <Paragraph style={{ marginTop: 8 }}>
          具体的记录值会在申请证书时由系统提供。添加后请等待 DNS 生效（通常 1-5 分钟），
          然后点击「验证」按钮。
        </Paragraph>
      </>
    ),
  },
  {
    key: 'txt-2',
    label: 'TXT 记录添加后验证失败？',
    children: (
      <Paragraph>
        常见原因：① DNS 尚未生效，请等待几分钟后重试；② 记录值复制错误，请仔细核对；
        ③ 部分 DNS 服务商会自动添加域名后缀，导致实际记录名变为
        <Text code>_acme-challenge.example.com.example.com</Text>，请检查是否重复。
      </Paragraph>
    ),
  },
  {
    key: 'txt-3',
    label: '通配符证书必须使用 DNS 验证吗？',
    children: (
      <Paragraph>
        <Text strong>是的。</Text>根据 ACME 协议规范，通配符证书（*.example.com）
        只能通过 DNS-01 方式验证域名所有权，不支持 HTTP-01 验证。
      </Paragraph>
    ),
  },
];

const FAQ_DCV = [
  {
    key: 'dcv-1',
    label: '什么是 DCV 代理？',
    children: (
      <Paragraph>
        DCV（Domain Control Validation）代理是一种委托验证机制。当您无法直接操作域名的 DNS 或 Web 服务器时，
        可以通过 CNAME 将验证请求代理到本平台，由平台代为完成验证。
      </Paragraph>
    ),
  },
  {
    key: 'dcv-2',
    label: '如何使用 DCV 代理？',
    children: (
      <>
        <Paragraph>在申请证书时选择「DCV 代理」验证方式，然后按照提示添加 CNAME 记录：</Paragraph>
        <div className={styles.highlight}>
          <Text code>_acme-challenge.example.com CNAME _acme-challenge.example.com.your-proxy-domain.</Text>
        </div>
        <Paragraph style={{ marginTop: 8 }}>
          添加 CNAME 后，后续的证书申请和续期都将自动通过代理完成验证，无需每次手动操作。
        </Paragraph>
      </>
    ),
  },
  {
    key: 'dcv-3',
    label: 'DCV 代理和直接 DNS 验证有什么区别？',
    children: (
      <Paragraph>
        直接 DNS 验证需要每次申请/续期时手动添加 TXT 记录；DCV 代理只需一次性配置 CNAME，
        之后所有验证都由平台自动处理。适合需要频繁续期或管理多个域名的场景。
      </Paragraph>
    ),
  },
];

/* ========== 锚点配置 ========== */

const ANCHOR_ITEMS = [
  { key: 'tutorial', href: '#tutorial', title: '使用教程' },
  { key: 'tutorial-ca', href: '#tutorial-ca', title: '　证书品牌' },
  { key: 'tutorial-type', href: '#tutorial-type', title: '　证书种类' },
  { key: 'tutorial-algo', href: '#tutorial-algo', title: '　加密算法' },
  { key: 'tutorial-verify', href: '#tutorial-verify', title: '　验证流程' },
  { key: 'faq', href: '#faq', title: '常见问题' },
  { key: 'faq-cert', href: '#faq-cert', title: '　证书问题' },
  { key: 'faq-caa', href: '#faq-caa', title: '　CAA 记录' },
  { key: 'faq-txt', href: '#faq-txt', title: '　TXT 解析' },
  { key: 'faq-dcv', href: '#faq-dcv', title: '　DCV 代理' },
];

/* ========== 页面组件 ========== */

export default function HelpPage() {
  return (
    <PageShell>
      <div className={styles.container}>
        <SectionHeader
          icon={<HelpCircle size={18} />}
          title="帮助文档"
          subtitle="使用教程与常见问题解答"
        />

        <div className={styles.layout}>
          {/* 左侧内容区 */}
          <div className={styles.content}>
            {/* ====== 使用教程 ====== */}
            <div id="tutorial">
              <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={20} /> 使用教程
              </Title>
            </div>

            {/* 证书品牌 */}
            <Card className={styles.sectionCard} id="tutorial-ca" title={<><Globe size={16} /> 支持的证书品牌</>}>
              <Paragraph>
                本平台通过 ACME 协议对接多家免费 CA（证书颁发机构），您可以根据需求选择：
              </Paragraph>
              <div className={styles.tagGroup}>
                {CA_BRANDS.map((ca) => (
                  <Tag key={ca.name} color={ca.color}>{ca.name}</Tag>
                ))}
              </div>
              {CA_BRANDS.map((ca) => (
                <Paragraph key={ca.name}>
                  <Text strong>{ca.name}</Text>：{ca.desc}
                </Paragraph>
              ))}
            </Card>

            {/* 证书种类 */}
            <Card className={styles.sectionCard} id="tutorial-type" title={<><ShieldCheck size={16} /> 证书种类</>}>
              <Paragraph>
                根据保护的域名范围，证书分为以下几种类型：
              </Paragraph>
              {CERT_TYPES.map((t) => (
                <Paragraph key={t.name}>
                  <Text strong>{t.name}</Text>：{t.desc}
                </Paragraph>
              ))}
              <Paragraph type="secondary">
                提示：所有免费 ACME 证书均为 DV（域名验证）级别，适用于个人网站和中小型项目。
              </Paragraph>
            </Card>

            {/* 加密算法 */}
            <Card className={styles.sectionCard} id="tutorial-algo" title={<><Lock size={16} /> 加密算法</>}>
              <Paragraph>
                申请证书时可选择密钥算法，不同算法在安全性和性能上有所差异：
              </Paragraph>
              {ALGORITHMS.map((a) => (
                <Paragraph key={a.name}>
                  <Text strong>{a.name}</Text>
                  {a.tag && <Tag color="green" style={{ marginLeft: 8 }}>{a.tag}</Tag>}
                  ：{a.desc}
                </Paragraph>
              ))}
              <Paragraph type="secondary">
                建议：如无特殊兼容性需求，推荐使用 ECC P-256，密钥更短、TLS 握手更快。
              </Paragraph>
            </Card>

            {/* 域名验证流程 */}
            <Card className={styles.sectionCard} id="tutorial-verify" title={<><FileKey size={16} /> 域名验证流程</>}>
              <Paragraph>
                ACME 协议要求在签发证书前验证域名所有权，支持以下验证方式：
              </Paragraph>

              <Title level={5}>DNS-01 验证</Title>
              <Paragraph>
                通过在域名 DNS 中添加指定的 TXT 记录来证明域名所有权。
              </Paragraph>
              <div className={styles.highlight}>
                <Paragraph style={{ margin: 0 }}>
                  1. 提交证书申请，系统生成验证令牌<br />
                  2. 在 DNS 中添加 <Text code>_acme-challenge.域名</Text> 的 TXT 记录<br />
                  3. 等待 DNS 生效后点击「验证」<br />
                  4. 验证通过后系统自动签发证书
                </Paragraph>
              </div>
              <Paragraph type="secondary">适用场景：所有证书类型，通配符证书必须使用此方式。</Paragraph>

              <Divider />

              <Title level={5}>HTTP-01 验证</Title>
              <Paragraph>
                通过在 Web 服务器指定路径放置验证文件来证明域名所有权。
              </Paragraph>
              <div className={styles.highlight}>
                <Paragraph style={{ margin: 0 }}>
                  1. 提交证书申请，系统生成验证令牌<br />
                  2. 将令牌文件放置到 <Text code>http://域名/.well-known/acme-challenge/</Text> 路径下<br />
                  3. 确保该 URL 可被公网访问后点击「验证」<br />
                  4. 验证通过后系统自动签发证书
                </Paragraph>
              </div>
              <Paragraph type="secondary">适用场景：单域名和多域名证书（不支持通配符）。</Paragraph>
            </Card>

            <Divider />

            {/* ====== 常见问题 ====== */}
            <div id="faq">
              <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} /> 常见问题
              </Title>
            </div>

            {/* 证书问题 */}
            <div id="faq-cert">
              <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} /> 常见证书问题
              </Title>
              <Collapse items={FAQ_CERT} style={{ marginBottom: 20 }} />
            </div>

            {/* CAA 记录 */}
            <div id="faq-caa">
              <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Server size={16} /> CAA 记录问题
              </Title>
              <Collapse items={FAQ_CAA} style={{ marginBottom: 20 }} />
            </div>

            {/* TXT 解析 */}
            <div id="faq-txt">
              <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={16} /> TXT 解析问题
              </Title>
              <Collapse items={FAQ_TXT} style={{ marginBottom: 20 }} />
            </div>

            {/* DCV 代理 */}
            <div id="faq-dcv">
              <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileKey size={16} /> DCV 代理问题
              </Title>
              <Collapse items={FAQ_DCV} style={{ marginBottom: 20 }} />
            </div>
          </div>

          {/* 右侧锚点导航 */}
          <div className={styles.anchor}>
            <Anchor items={ANCHOR_ITEMS} offsetTop={80} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
