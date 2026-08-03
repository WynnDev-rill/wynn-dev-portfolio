import {
  ArrowRight,
  ArrowSquareOut,
  EnvelopeSimple,
  GithubLogo,
  WaveSine,
} from "@phosphor-icons/react";

interface IconProps {
  size?: number;
  className?: string;
}

export function ArrowIcon({ size = 18, className }: IconProps) {
  return <ArrowRight className={className} size={size} weight="regular" aria-hidden="true" />;
}

export function ExternalIcon({ size = 16, className }: IconProps) {
  return <ArrowSquareOut className={className} size={size} weight="regular" aria-hidden="true" />;
}

export function GithubIcon({ size = 18, className }: IconProps) {
  return <GithubLogo className={className} size={size} weight="fill" aria-hidden="true" />;
}

export function MotionIcon({ size = 18, className }: IconProps) {
  return <WaveSine className={className} size={size} weight="regular" aria-hidden="true" />;
}

export function MailIcon({ size = 18, className }: IconProps) {
  return <EnvelopeSimple className={className} size={size} weight="regular" aria-hidden="true" />;
}
