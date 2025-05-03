/**
 * Basic Discord user information
 */
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  flags?: number;
  tag?: string; // Usually username#discriminator or just username for new users
}

/**
 * Discord guild (server) information
 */
export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  ownerId: string;
  features: string[];
}

/**
 * Discord channel base interface
 */
export interface DiscordChannelBase {
  id: string;
  type: ChannelType;
  name?: string;
  guild_id?: string;
  position?: number;
  permission_overwrites?: PermissionOverwrite[];
  parent_id?: string | null;
}

/**
 * Discord voice channel information
 */
export interface VoiceChannel extends DiscordChannelBase {
  type: ChannelType.GUILD_VOICE | ChannelType.GUILD_STAGE_VOICE;
  rtc_region?: string | null;
  user_limit?: number;
  bitrate?: number;
}

/**
 * Discord text channel information
 */
export interface TextChannel extends DiscordChannelBase {
  type: ChannelType.GUILD_TEXT | ChannelType.GUILD_ANNOUNCEMENT;
  topic?: string | null;
  rate_limit_per_user?: number;
  last_message_id?: string | null;
}

/**
 * Discord DM channel information
 */
export interface DMChannel extends DiscordChannelBase {
  type: ChannelType.DM | ChannelType.GROUP_DM;
  recipients?: DiscordUser[];
  last_message_id?: string | null;
}

/**
 * Discord voice state information
 */
export interface VoiceState {
  guild_id?: string;
  channel_id: string | null;
  user_id: string;
  member?: GuildMember;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_deaf: boolean;
  self_mute: boolean;
  self_stream?: boolean;
  self_video: boolean;
  suppress: boolean;
  request_to_speak_timestamp?: string | null;
}

/**
 * Discord guild member information
 */
export interface GuildMember {
  user?: DiscordUser;
  nick?: string | null;
  roles: string[];
  joined_at: string;
  premium_since?: string | null;
  deaf: boolean;
  mute: boolean;
  pending?: boolean;
  avatar?: string | null;
}

/**
 * Discord message information
 */
export interface DiscordMessage {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: DiscordUser;
  member?: GuildMember;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: DiscordUser[];
  mention_roles: string[];
  attachments: Attachment[];
  embeds: Embed[];
  reactions?: Reaction[];
  nonce?: string | number;
  pinned: boolean;
  webhook_id?: string;
  type: MessageType;
  referenced_message?: DiscordMessage | null;
}

/**
 * Discord message attachment
 */
export interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number | null;
  width?: number | null;
  content_type?: string;
}

/**
 * Discord message embed
 */
export interface Embed {
  title?: string;
  type?: EmbedType;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

/**
 * Discord message reaction
 */
export interface Reaction {
  count: number;
  me: boolean;
  emoji: Emoji;
}

/**
 * Discord emoji
 */
export interface Emoji {
  id: string | null;
  name: string | null;
  roles?: string[];
  user?: DiscordUser;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}

/**
 * Discord permission overwrite
 */
export interface PermissionOverwrite {
  id: string;
  type: OverwriteType;
  allow: string;
  deny: string;
}

/**
 * Embed footer information
 */
export interface EmbedFooter {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

/**
 * Embed image information
 */
export interface EmbedImage {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

/**
 * Embed thumbnail information
 */
export interface EmbedThumbnail {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

/**
 * Embed video information
 */
export interface EmbedVideo {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

/**
 * Embed provider information
 */
export interface EmbedProvider {
  name?: string;
  url?: string;
}

/**
 * Embed author information
 */
export interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

/**
 * Embed field information
 */
export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

/**
 * Channel types enumeration
 */
export enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_ANNOUNCEMENT = 5,
  ANNOUNCEMENT_THREAD = 10,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
  GUILD_DIRECTORY = 14,
  GUILD_FORUM = 15,
}

/**
 * Message types enumeration
 */
export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  GUILD_MEMBER_JOIN = 7,
  USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
  THREAD_CREATED = 18,
  REPLY = 19,
  CHAT_INPUT_COMMAND = 20,
  THREAD_STARTER_MESSAGE = 21,
  GUILD_INVITE_REMINDER = 22,
  CONTEXT_MENU_COMMAND = 23,
  AUTO_MODERATION_ACTION = 24,
}

/**
 * Embed types enumeration
 */
export enum EmbedType {
  RICH = 'rich',
  IMAGE = 'image',
  VIDEO = 'video',
  GIFV = 'gifv',
  ARTICLE = 'article',
  LINK = 'link',
  AUTO_MODERATION_MESSAGE = 'auto_moderation_message',
}

/**
 * Permission overwrite types enumeration
 */
export enum OverwriteType {
  ROLE = 0,
  MEMBER = 1,
}

/**
 * Discord events
 */
export interface DiscordVoiceChannelJoinEvent {
  channel: VoiceChannel;
  users: DiscordUser[];
}

export interface DiscordVoiceChannelLeaveEvent {
  channel: VoiceChannel | null;
}

export interface DiscordUserJoinVoiceEvent {
  channel: VoiceChannel;
  user: DiscordUser;
}

export interface DiscordUserLeaveVoiceEvent {
  channel: VoiceChannel;
  userId: string;
  user?: DiscordUser;
}

export interface DiscordMessageReceivedEvent {
  channelId: string;
  message: DiscordMessage;
}

/**
 * Voice connection status
 */
export enum VoiceConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  VOICE_SERVER_UPDATE = 'voice_server_update',
}