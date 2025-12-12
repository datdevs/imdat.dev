export interface Person {
  readonly description: string;
  readonly image: {
    readonly alt: string;
    readonly height?: number;
    readonly src: string;
    readonly width?: number;
  };
  readonly name: string;
  readonly socialLinks: readonly SocialLink[];
}

export interface SocialLink {
  // All popular social media platforms
  readonly platform:
    | 'discord'
    | 'facebook'
    | 'instagram'
    | 'line'
    | 'linkedin'
    | 'pinterest'
    | 'snapchat'
    | 'telegram'
    | 'threads'
    | 'tiktok'
    | 'tumblr'
    | 'whatsapp'
    | 'x';
  readonly url: string;
}
