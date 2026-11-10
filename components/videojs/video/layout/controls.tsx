import { Controls, Time, Tooltip } from '@videojs/react';
import type { ComponentProps } from 'react';

import { AirPlayButton } from '@/components/videojs/ui/airplay-button';
import { ButtonTooltip } from '@/components/videojs/ui/button-tooltip';
import { CaptionsButton } from '@/components/videojs/ui/captions-button';
import { CastButton } from '@/components/videojs/ui/cast-button';
import { FullscreenButton } from '@/components/videojs/ui/fullscreen-button';
import { PiPButton } from '@/components/videojs/ui/pip-button';
import { PlayButton } from '@/components/videojs/ui/play-button';
import { TimeSlider } from '@/components/videojs/ui/time-slider';
import { VolumePopover } from '@/components/videojs/ui/volume-popover';
import { cn } from '@/lib/resolve-class-name';

import { VideoSettingsMenu } from '../menus/settings-menu';

export interface DefaultVideoControlsProps {
  renderThumbnail?: NonNullable<ComponentProps<typeof TimeSlider>>['renderThumbnail'];
}

/** Translucent pill behind control groups (YouTube-style). */
const pill = 'rounded-full bg-black/45 ring-1 ring-white/10 backdrop-blur-md';

/**
 * StreamCraft layout (edited from the Video.js default skin source):
 * full-width progress bar on top, then a row with play / volume / time pills on the left
 * and one pill of captions, settings, cast, AirPlay, PiP and fullscreen on the right.
 */
export function DefaultVideoControls({ renderThumbnail }: DefaultVideoControlsProps = {}) {
  return (
    <Controls.Root>
      <Controls.Backdrop
        className={cn(
          'pointer-events-none absolute inset-0 z-10 rounded-[inherit]',
          'bg-linear-to-t from-black/70 via-transparent via-35% to-transparent',
          'transition-opacity duration-media-controls ease-out not-data-visible:opacity-0'
        )}
      />
      <Controls.Content
        className={cn(
          'video-controls absolute inset-x-0 bottom-0 z-30 flex flex-col px-3 pb-3 media-lg:px-4',
          'text-media-controls-foreground',
          'transition-opacity duration-media-controls-enter ease-out',
          'not-data-visible:pointer-events-none not-data-visible:opacity-0 not-data-visible:duration-media-controls'
        )}
      >
        <Tooltip.Provider>
          {/* flex-none: the skin's slider is flex-1, which collapses its height in this column layout */}
          <TimeSlider renderThumbnail={renderThumbnail} className={'w-full flex-none [--media-slider-height:1.25rem]'} />

          <div className={'flex items-center justify-between gap-2'}>
            <Controls.Group className={'flex min-w-0 items-center gap-2'}>
              <ButtonTooltip side="top">
                <PlayButton className={pill} />
              </ButtonTooltip>
              <VolumePopover className={pill} />
              <div
                className={cn(
                  pill,
                  'flex h-media-control items-center gap-1 px-4 text-sm tabular-nums',
                  'media-max-xs:hidden'
                )}
              >
                <Time.Value type="current" />
                <span className={'opacity-70'}>/</span>
                <Time.Value type="duration" className={'opacity-70'} />
              </div>
            </Controls.Group>

            <Controls.Group className={cn(pill, 'flex shrink-0 items-center')}>
              <ButtonTooltip side="top">
                <CaptionsButton className={'media-max-sm:hidden'} />
              </ButtonTooltip>
              <VideoSettingsMenu />
              <ButtonTooltip side="top">
                <CastButton className={'media-max-md:hidden'} />
              </ButtonTooltip>
              <ButtonTooltip side="top">
                <AirPlayButton className={'media-max-md:hidden'} />
              </ButtonTooltip>
              <ButtonTooltip side="top">
                <PiPButton className={'media-max-sm:hidden'} />
              </ButtonTooltip>
              <ButtonTooltip side="top">
                <FullscreenButton />
              </ButtonTooltip>
            </Controls.Group>
          </div>
        </Tooltip.Provider>
      </Controls.Content>
    </Controls.Root>
  );
}
