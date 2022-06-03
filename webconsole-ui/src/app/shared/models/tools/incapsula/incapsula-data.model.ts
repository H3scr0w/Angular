// Generated using typescript-generator version 2.0.400 on 2019-01-29 10:15:00.

/**
 * IncapsulaResponse Object
 */
export interface IncapsulaResponse {
  res: number;
  res_message: string;
  status: string;
  ips: string[];
  dns: Dn[];
  original_dns: OriginalDn[];
  warnings: Warning[];
  security: Security;
  active: string;
  acceleration_level: string;
  site_creation_date: number;
  sealLocation: SealLocation;
  ssl: Ssl;
  login_protect: LoginProtect;
  performance_configuration: PerformanceConfiguration;
  visits_timeseries: VisitsTimeseries[];
  requests_geo_dist_summary: RequestsGeoDistSummary;
  caching: Caching;
  caching_timeseries: CachingTimeseries[];
  hits_timeseries: HitsTimeseries[];
  threats: Threat[];
  visits_dist_summary: VisitsDistSummary[];
  bandwidth_timeseries: BandwidthTimeseries[];
  visits: Visit[];
}

/**
 * WAF AclsConfiguration Object
 */
export class AclsConfiguration {
  ruleId: AclsRules;
  urls: string[];
  urlPatterns: UrlPatterns[];
  countries: Countries[];
  continents: Continents[];
  ips: string[];
}

/**
 * WAF CacheMode Object
 */
export interface CacheMode {
  cacheMode: CacheModes;
  dynamicCacheDuration: number;
  aggressiveCacheDuration: number;
  durationPeriod: DurationPeriod;
}

/**
 * WAF CacheRules Object
 */
export class CacheRules {
  cacheHeaders: string[];
  alwaysCacheResourceUrl: string[];
  alwaysCacheResourcePattern: UrlPatterns[];
  alwaysCacheResourceDuration: number;
  durationPeriod: DurationPeriod;
  neverCacheResourceUrl: string[];
  neverCacheResourcePattern: UrlPatterns[];
  clearAlwaysCacheRules: boolean;
  clearNeverCacheRules: boolean;
  clearCacheHeadersRules: boolean;
}

/**
 * WAF CacheSettings Object
 */
export interface CacheSettings {
  param: CacheSettingParams;
  value: boolean;
}

/**
 * WAF Site Object
 */
export interface Site {
  domain: string;
  siteIp: string[];
  removeSsl: boolean;
  tests: StatusTests[];
}

/**
 * SiteCertificate Object
 */
export interface SiteCertificate {
  certificate: string;
  privatekey: string;
  passphrase: string;
}

/**
 * Statistic Object
 */
export interface Statistic {
  timeRange: TimeRanges;
  stats: StatsNames[];
}

/**
 * WAF ThreatsConfiguration Object
 */
export class ThreatsConfiguration {
  ruleId: ThreatRules;
  securityRuleAction: ThreatActions;
  blockBadBots: boolean;
  challengeSuspectedBots: boolean;
  activationMode: ActivationMode;
  ddosTrafficThreshold: number;
  quarantinedUrls: string[];
}

/**
 * TrafficVisit Object
 */
export interface TrafficVisit {
  timeRange: TimeRanges;
  securities: (ThreatRules | ThreatActions)[];
  countries: string[];
  ips: string[];
  visitIds: string[];
  listLiveVisits: boolean;
}

/**
 * WAF Acls Object
 */
export interface Acls {
  rules: Rule[];
}

/**
 * WAF Geo Object
 */
export interface Geo {
  countries: Countries[];
  continents: Continents[];
}

/**
 * WAF Action Object
 */
export interface Action {
  requestResult: string;
  isSecured: boolean;
  url: string;
  threats: Threat[];
}

/**
 * WAF AdvancedCachingRules Object
 */
export interface AdvancedCachingRules {
  never_cache_resources: NeverCacheResource[];
  always_cache_resources: AlwaysCacheResource[];
}

/**
 * WAF AlwaysCacheResource Object
 */
export interface AlwaysCacheResource {
  pattern: string;
  url: string;
  ttl: number;
  ttlUnits: string;
}

/**
 * WAF BandwidthTimeseries Object
 */
export interface BandwidthTimeseries {
  data: number[][];
  id: string;
  name: string;
}

/**
 * WAF CacheHeader Object
 */
export interface CacheHeader {
  headerName: string;
}

/**
 * WAF Caching Object
 */
export interface Caching {
  saved_requests: number;
  total_requests: number;
  saved_bytes: number;
  total_bytes: number;
}

/**
 * WAF CachingTimeseries Object
 */
export interface CachingTimeseries {
  id: string;
  name: string;
  data: number[][];
}

/**
 * WAF CustomCertificate Object
 */
export interface CustomCertificate {
  active: boolean;
  expirationDate: number;
  revocationError: boolean;
  validityError: boolean;
  chainError: boolean;
  hostnameMismatchError: boolean;
}

/**
 * WAF Dn Object
 */
export interface Dn {
  dns_record_name: string;
  set_type_to: string;
  set_data_to: string[];
}

/**
 * WAF Exception Object
 */
export interface Exception {
  values: Value[];
  id: number;
}

/**
 * WAF GeneratedCertificate Object
 */
export interface GeneratedCertificate {
  ca: string;
  validation_method: string;
  validation_data: string;
  san: string[];
  validation_status: string;
}

/**
 * WAF HitsTimeseries Object
 */
export interface HitsTimeseries {
  id: string;
  name: string;
  data: number[][];
}

/**
 * WAF LoginProtect Object
 */
export interface LoginProtect {
  enabled: boolean;
  specific_users_list: SpecificUsersList[];
  send_lp_notifications: boolean;
  allow_all_users: boolean;
  authentication_methods: string[];
  urls: string[];
  url_patterns: string[];
}

/**
 * WAF NeverCacheResource Object
 */
export interface NeverCacheResource {
  pattern: string;
  url: string;
}

/**
 * WAF OriginServer Object
 */
export interface OriginServer {
  detected: boolean;
  detectionStatus: string;
}

/**
 * WAF OriginalDn Object
 */
export interface OriginalDn {
  dns_record_name: string;
  set_type_to: string;
  set_data_to: string[];
}

/**
 * WAF PerformanceConfiguration Object
 */
export interface PerformanceConfiguration {
  advanced_caching_rules: AdvancedCachingRules;
  acceleration_level: string;
  async_validation: boolean;
  minify_javascript: boolean;
  minify_css: boolean;
  minify_static_html: boolean;
  compress_jpeg: boolean;
  progressive_image_rendering: boolean;
  aggressive_compression: boolean;
  compress_png: boolean;
  on_the_fly_compression: boolean;
  tcp_pre_pooling: boolean;
  comply_no_cache: boolean;
  comply_vary: boolean;
  use_shortest_caching: boolean;
  support_all_tls_versions: boolean;
  prefer_last_modified: boolean;
  disable_client_side_caching: boolean;
  cache_headers: CacheHeader[];
}

/**
 * WAF RequestsGeoDistSummary Object
 */
export interface RequestsGeoDistSummary {
  id: string;
  name: string;
  data: string[][];
}

/**
 * WAF Rules Object
 */
export interface Rule {
  id: string;
  name: string;
  block_bad_bots: boolean;
  challenge_suspected_bots: boolean;
  action: string;
  action_text: string;
  exceptions: Exception[];
  activation_mode: string;
  activation_mode_text: string;
  ddos_traffic_threshold: number;
  ddos_traffic_threshold_text: string;
  geo: Geo;
  urls: Url[];
  ips: string[];
}

/**
 * WAF SealLocation Object
 */
export interface SealLocation {
  id: string;
  name: string;
}

/**
 * WAF Security Object
 */
export interface Security {
  waf: Waf;
  acls: Acls;
}

/**
 * WAF SecuritySummary Object
 */
export interface SecuritySummary {
  'api.threats.sql_injection': number;
  'api.threats.cross_site_scripting': number;
  'api.threats.illegal_resource_access': number;
  'api.threats.remote_file_inclusion': number;
  'api.threats.customRule': number;
  'api.threats.ddos': number;
  'api.threats.backdoor': number;
  'api.threats.bot_access_control': number;
  'api.acl.blacklisted_countries': number;
  'api.acl.blacklisted_urls': number;
  'api.acl.blacklisted_ips': number;
}

/**
 * WAF SpecificUsersList Object
 */
export interface SpecificUsersList {
  email: string;
  name: string;
  status: string;
}

/**
 * WAF Ssl Object
 */
export interface Ssl {
  origin_server: OriginServer;
  generated_certificate: GeneratedCertificate;
  custom_certificate: CustomCertificate;
}

/**
 * WAF Threat Object
 */
export class Threat {
  id: string;
  name: string;
  incidents: number;
  status: string;
  status_text_id: string;
  status_text: string;
  followup: string;
  followup_text: string;
  followup_url: string;
  securityRule: string;
  alertLocation: string;
  attackCodes: string[];
  securityRuleAction: string;

  constructor(id: string, incidents: number) {
    this.id = id;
    this.incidents = incidents;
  }
}

/**
 * WAF Url Object
 */
export class Url {
  value: string;
  pattern: string;
}

/**
 * WAF Value Object
 */
export interface Value {
  urls: Url[];
  id: string;
  name: string;
}

/**
 * WAF Visit Object
 */
export interface Visit {
  id: string;
  siteId: number;
  startTime: number;
  clientIPs: string[];
  country: string[];
  countryCode: string[];
  clientType: string;
  clientApplication: string;
  clientApplicationVersion: string;
  httpVersion: string;
  userAgent: string;
  os: string;
  osVersion: string;
  supportsCookies: boolean;
  supportsJavaScript: boolean;
  hits: number;
  pageViews: number;
  entryReferer: string;
  entryPage: string;
  servedVia: string[];
  securitySummary: SecuritySummary;
  actions: Action[];
}

/**
 * WAF VisitsDistSummary Object
 */
export interface VisitsDistSummary {
  data: string[][];
  id: string;
  name: string;
}

/**
 * WAF VisitsTimeseries Object
 */
export interface VisitsTimeseries {
  id: string;
  name: string;
  data: number[][];
}

/**
 * WAF Object
 */
export interface Waf {
  rules: Rule[];
}

/**
 * WAF Warning Object
 */
export interface Warning {
  type: string;
  dns_record_name: string;
  set_type_to: string;
  set_data_to: string;
  mail_record_name: string;
}

export enum AclsRules {
  blacklisted_countries = 'blacklisted_countries',
  blacklisted_urls = 'blacklisted_urls',
  blacklisted_ips = 'blacklisted_ips',
  whitelisted_ips = 'whitelisted_ips'
}

export enum ActivationMode {
  off = 'off',
  auto = 'auto',
  on = 'on'
}

export enum CacheModes {
  disable = 'disable',
  static_only = 'static_only',
  static_and_dynamic = 'static_and_dynamic',
  aggressive = 'aggressive'
}

export enum CacheSettingParams {
  async_validation = 'async_validation',
  minify_javascript = 'minify_javascript',
  minify_css = 'minify_css',
  minify_static_html = 'minify_static_html',
  compress_jpeg = 'compress_jpeg',
  progressive_image_rendering = 'progressive_image_rendering',
  aggressive_compression = 'aggressive_compression',
  compress_png = 'compress_png',
  on_the_fly_compression = 'on_the_fly_compression',
  tcp_pre_pooling = 'tcp_pre_pooling',
  comply_no_cache = 'comply_no_cache',
  comply_vary = 'comply_vary',
  use_shortest_caching = 'use_shortest_caching',
  prefer_last_modified = 'prefer_last_modified',
  disable_client_side_caching = 'disable_client_side_caching',
  cache_300x = 'cache_300x'
}

export enum Continents {
  AF = 'AF',
  NA = 'NA',
  OC = 'OC',
  AN = 'AN',
  AS = 'AS',
  EU = 'EU',
  SA = 'SA'
}

export enum Countries {
  AD = 'AD',
  AE = 'AE',
  AF = 'AF',
  AG = 'AG',
  AI = 'AI',
  AL = 'AL',
  AM = 'AM',
  AO = 'AO',
  AQ = 'AQ',
  AR = 'AR',
  AS = 'AS',
  AT = 'AT',
  AU = 'AU',
  AW = 'AW',
  AX = 'AX',
  AZ = 'AZ',
  BA = 'BA',
  BB = 'BB',
  BD = 'BD',
  BE = 'BE',
  BF = 'BF',
  BG = 'BG',
  BH = 'BH',
  BI = 'BI',
  BJ = 'BJ',
  BL = 'BL',
  BM = 'BM',
  BN = 'BN',
  BO = 'BO',
  BQ = 'BQ',
  BR = 'BR',
  BS = 'BS',
  BT = 'BT',
  BV = 'BV',
  BW = 'BW',
  BY = 'BY',
  BZ = 'BZ',
  CA = 'CA',
  CC = 'CC',
  CD = 'CD',
  CF = 'CF',
  CG = 'CG',
  CH = 'CH',
  CI = 'CI',
  CK = 'CK',
  CL = 'CL',
  CM = 'CM',
  CN = 'CN',
  CO = 'CO',
  CR = 'CR',
  CU = 'CU',
  CV = 'CV',
  CW = 'CW',
  CX = 'CX',
  CY = 'CY',
  CZ = 'CZ',
  DE = 'DE',
  DJ = 'DJ',
  DK = 'DK',
  DM = 'DM',
  DO = 'DO',
  DZ = 'DZ',
  EC = 'EC',
  EE = 'EE',
  EG = 'EG',
  EH = 'EH',
  ER = 'ER',
  ES = 'ES',
  ET = 'ET',
  FI = 'FI',
  FJ = 'FJ',
  FK = 'FK',
  FM = 'FM',
  FO = 'FO',
  FR = 'FR',
  GA = 'GA',
  GB = 'GB',
  GD = 'GD',
  GE = 'GE',
  GF = 'GF',
  GG = 'GG',
  GH = 'GH',
  GI = 'GI',
  GL = 'GL',
  GM = 'GM',
  GN = 'GN',
  GP = 'GP',
  GQ = 'GQ',
  GR = 'GR',
  GS = 'GS',
  GT = 'GT',
  GU = 'GU',
  GW = 'GW',
  GY = 'GY',
  HK = 'HK',
  HM = 'HM',
  HN = 'HN',
  HR = 'HR',
  HT = 'HT',
  HU = 'HU',
  ID = 'ID',
  IE = 'IE',
  IL = 'IL',
  IM = 'IM',
  IN = 'IN',
  IO = 'IO',
  IQ = 'IQ',
  IR = 'IR',
  IS = 'IS',
  IT = 'IT',
  JE = 'JE',
  JM = 'JM',
  JO = 'JO',
  JP = 'JP',
  KE = 'KE',
  KG = 'KG',
  KH = 'KH',
  KI = 'KI',
  KM = 'KM',
  KN = 'KN',
  KP = 'KP',
  KR = 'KR',
  KW = 'KW',
  KY = 'KY',
  KZ = 'KZ',
  LA = 'LA',
  LB = 'LB',
  LC = 'LC',
  LI = 'LI',
  LK = 'LK',
  LR = 'LR',
  LS = 'LS',
  LT = 'LT',
  LU = 'LU',
  LV = 'LV',
  LY = 'LY',
  MA = 'MA',
  MC = 'MC',
  MD = 'MD',
  ME = 'ME',
  MF = 'MF',
  MG = 'MG',
  MH = 'MH',
  MK = 'MK',
  ML = 'ML',
  MM = 'MM',
  MN = 'MN',
  MO = 'MO',
  MP = 'MP',
  MQ = 'MQ',
  MR = 'MR',
  MS = 'MS',
  MT = 'MT',
  MU = 'MU',
  MV = 'MV',
  MW = 'MW',
  MX = 'MX',
  MY = 'MY',
  MZ = 'MZ',
  NA = 'NA',
  NC = 'NC',
  NE = 'NE',
  NF = 'NF',
  NG = 'NG',
  NI = 'NI',
  NL = 'NL',
  NO = 'NO',
  NP = 'NP',
  NR = 'NR',
  NU = 'NU',
  NZ = 'NZ',
  OM = 'OM',
  PA = 'PA',
  PE = 'PE',
  PF = 'PF',
  PG = 'PG',
  PH = 'PH',
  PK = 'PK',
  PL = 'PL',
  PM = 'PM',
  PN = 'PN',
  PR = 'PR',
  PS = 'PS',
  PT = 'PT',
  PW = 'PW',
  PY = 'PY',
  QA = 'QA',
  RE = 'RE',
  RO = 'RO',
  RS = 'RS',
  RU = 'RU',
  RW = 'RW',
  SA = 'SA',
  SB = 'SB',
  SC = 'SC',
  SD = 'SD',
  SE = 'SE',
  SG = 'SG',
  SH = 'SH',
  SI = 'SI',
  SJ = 'SJ',
  SK = 'SK',
  SL = 'SL',
  SM = 'SM',
  SN = 'SN',
  SO = 'SO',
  SR = 'SR',
  SS = 'SS',
  ST = 'ST',
  SV = 'SV',
  SX = 'SX',
  SY = 'SY',
  SZ = 'SZ',
  TC = 'TC',
  TD = 'TD',
  TF = 'TF',
  TG = 'TG',
  TH = 'TH',
  TJ = 'TJ',
  TK = 'TK',
  TL = 'TL',
  TM = 'TM',
  TN = 'TN',
  TO = 'TO',
  TR = 'TR',
  TT = 'TT',
  TV = 'TV',
  TW = 'TW',
  TZ = 'TZ',
  UA = 'UA',
  UG = 'UG',
  UM = 'UM',
  US = 'US',
  UY = 'UY',
  UZ = 'UZ',
  VA = 'VA',
  VC = 'VC',
  VE = 'VE',
  VG = 'VG',
  VI = 'VI',
  VN = 'VN',
  VU = 'VU',
  WF = 'WF',
  WS = 'WS',
  YE = 'YE',
  YT = 'YT',
  ZA = 'ZA',
  ZM = 'ZM',
  ZW = 'ZW'
}

export enum DurationPeriod {
  hr = 'hr',
  min = 'min',
  sec = 'sec',
  days = 'days',
  weeks = 'weeks'
}

export enum StatsNames {
  visits_timeseries = 'visits_timeseries',
  hits_timeseries = 'hits_timeseries',
  bandwidth_timeseries = 'bandwidth_timeseries',
  requests_geo_dist_summary = 'requests_geo_dist_summary',
  visits_dist_summary = 'visits_dist_summary',
  caching = 'caching',
  caching_timeseries = 'caching_timeseries',
  threats = 'threats',
  incap_rules = 'incap_rules',
  incap_rules_timeseries = 'incap_rules_timeseries'
}
export enum StatusTests {
  domain_validation = 'domain_validation',
  services = 'services',
  dns = 'dns'
}

export enum ThreatActions {
  disabled = 'disabled',
  alert = 'alert',
  block_request = 'block_request',
  block_user = 'block_user',
  block_ip = 'block_ip',
  quarantine_url = 'quarantine_url'
}

export enum ThreatRules {
  bot_access_control = 'bot_access_control',
  sql_injection = 'sql_injection',
  cross_site_scripting = 'cross_site_scripting',
  illegal_resource_access = 'illegal_resource_access',
  backdoor = 'backdoor',
  ddos = 'ddos',
  remote_file_inclusion = 'remote_file_inclusion'
}

export enum TimeRanges {
  today = 'today',
  last_7_days = 'last_7_days',
  last_30_days = 'last_30_days',
  last_90_days = 'last_90_days',
  month_to_date = 'month_to_date'
}

export enum UrlPatterns {
  contains = 'contains',
  equals = 'equals',
  prefix = 'prefix',
  suffix = 'suffix',
  not_equals = 'not_equals',
  not_contain = 'not_contain',
  not_prefix = 'not_prefix',
  not_suffix = 'not_suffix'
}
