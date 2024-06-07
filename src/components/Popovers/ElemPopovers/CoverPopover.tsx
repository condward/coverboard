import { FC } from 'react';
import { TextField, Button, Link, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ZodError } from 'zod';
import {
  DeleteOutline,
  LinkOutlined,
  RefreshOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@mui/icons-material';

import {
  CoverSchema,
  Media,
  SPACING_GAP,
  mediaMap,
  CoverSchemaOutput,
  coverSchema,
} from 'types';

import {
  CommonDialog,
  CommonTabs,
  SliderInput,
  DirectionRadio,
  FieldSet,
} from 'components';
import { useMainStore, useToastStore } from 'store';
import { useGetSizesContext } from 'providers';
import { useIsLandscape } from 'utils';

import { useSearchValue } from './useSearchValue';
import { CoverConnections } from './connections';

const getButtons = (media: Media, currentCover: CoverSchema) => {
  if (media === Media.MUSIC) {
    return [
      {
        name: 'LastFM',
        href: `http://www.last.fm/music/${currentCover.title.search}/${currentCover.subtitle.search}`,
      },
      {
        name: 'Spotify',
        href: `https://open.spotify.com/search/artist%3A${currentCover.title.search}%20AND%20album%3A${currentCover.subtitle.search}/`,
      },
    ];
  } else if (media === Media.MOVIE || media === Media.TVSHOW) {
    return [
      {
        name: 'TMDB',
        href: `https://www.themoviedb.org/search?query=${
          currentCover.title.search
        }${
          currentCover.subtitle.search
            ? '&year=' + currentCover.subtitle.search
            : ''
        }`,
      },
      {
        name: 'IMDB',
        href: `https://www.imdb.com/search/title/?title=${
          currentCover.title.search
        }${
          currentCover.subtitle.search
            ? `&release_date=${currentCover.subtitle.search}-01-01,${currentCover.subtitle.search}-12-31`
            : ''
        }`,
      },
    ];
  } else if (media === Media.BOOK) {
    const isbm = currentCover.link.match(/isbn\/(\d+)-/i);

    if (isbm && isbm.length > 0) {
      return [
        {
          name: 'Open library',
          href: `https://openlibrary.org/isbn/${isbm[1]}`,
        },
        {
          name: 'Google Books',
          href: `https://www.google.com/search?tbo=p&tbm=bks&q=intitle:${
            currentCover.title.search
          }${
            currentCover.subtitle.search
              ? '+inauthor:' + currentCover.subtitle.search
              : ''
          }`,
        },
      ];
    }
  }
  return [
    {
      name: 'RAWG',
      href: `https://rawg.io/search?query=${currentCover.title.search}`,
    },
    {
      name: 'Steam',
      href: `https://store.steampowered.com/search/?term=${currentCover.title.search}`,
    },
  ];
};

interface CoverPopoverProps {
  onClose: (id?: string) => void;
  onChange: (from: string, to: string) => void;
  cover: CoverSchema;
  onReturn?: () => void;
}

export const CoverPopover: FC<CoverPopoverProps> = ({
  cover,
  onClose,
  onChange,
  onReturn,
}) => {
  const titleLabel = useMainStore((state) => state.getTitleLabel().label);
  const subTitleLabel = useMainStore((state) => state.getSubTitleLabel().label);
  const media = useMainStore((state) => state.configs.media);
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const showSuccessMessage = useToastStore((state) => state.showSuccessMessage);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const resetCoverLabels = useMainStore((state) => state.resetCoverLabels);
  const updateCover = useMainStore((state) => state.updateCover);

  const buttons = getButtons(media, cover);
  const searchValue = useSearchValue(cover.id);
  const isLandscape = useIsLandscape();
  const { dragLimits, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
  } = useForm<CoverSchema, unknown, CoverSchemaOutput>({
    resolver: zodResolver(coverSchema),
    defaultValues: cover,
  });

  const onSubmit = handleSubmit(
    (values) => {
      updateCover(cover.id, {
        title: {
          text: values.title.text.trim(),
          dir: values.title.dir,
        },
        subtitle: {
          text: values.subtitle.text.trim(),
          dir: values.subtitle.dir,
        },
        star: {
          count: values.star.count,
          dir: values.star.dir,
        },
        x: values.x,
        y: values.y,
      });
      onClose();
    },
    (error) => {
      const errorMessage = Object.values(error).map((err) => err.message)[0];

      if (errorMessage !== undefined) {
        showErrorMessage(errorMessage);
      }
    },
  );

  const handleReset = () => {
    resetCoverLabels(cover.id);
    reset();
    onClose();
  };

  const handleDelete = () => {
    removeCoverAndRelatedLines(cover.id);
    onClose();
  };

  const handleSearchAgain = async () => {
    const values = getValues();

    const subTitleRequired = mediaMap[media].subtitle.required;
    if (!values.title.text) {
      showErrorMessage(`${mediaMap[media].title.label} is required`);
      return;
    } else if (subTitleRequired && !values.subtitle.text) {
      showErrorMessage(`${mediaMap[media].subtitle.label} is required`);
      return;
    }

    try {
      await searchValue.mutateAsync([
        {
          title: values.title.text,
          subtitle: values.subtitle.text,
        },
      ]);
      onClose();
      showSuccessMessage('Cover was updated with success');
    } catch (error) {
      if (error instanceof ZodError) {
        showErrorMessage('Bad response from the server');
      }
      showErrorMessage('Failed to fetch from the server');
    }
  };

  return (
    <CommonDialog
      onClose={() => onClose(cover.id)}
      onReturn={onReturn}
      title="Edit Cover"
      header={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          {buttons.map((button) => (
            <Button
              key={button.name}
              variant="outlined"
              color="info"
              target="_blank"
              component={Link}
              startIcon={<LinkOutlined />}
              href={button.href}>
              {button.name}
            </Button>
          ))}
        </Stack>
      }
      content={
        <CommonTabs
          tabs={[
            {
              label: 'Edit',
              value: 'edit',
              component: (
                <Stack direction="column" gap={SPACING_GAP}>
                  <Stack direction="row" justifyContent="end">
                    <legend>ID: {cover.id.slice(0, 8).toUpperCase()}</legend>
                  </Stack>
                  <FieldSet
                    label={
                      cover.title.search
                        ? `${titleLabel} (searched: ${cover.title.search})`
                        : titleLabel
                    }
                    direction="column">
                    <Controller
                      name="title.text"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label={`text`}
                          autoFocus
                          fullWidth
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      name="title.dir"
                      control={control}
                      render={({ field }) => (
                        <DirectionRadio
                          label="Position"
                          id="cover-title"
                          name="titleRadio"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FieldSet>
                  <FieldSet
                    label={
                      cover.subtitle.search
                        ? `${subTitleLabel} (searched: ${cover.subtitle.search})`
                        : subTitleLabel
                    }
                    direction="column">
                    <Controller
                      name="subtitle.text"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="text"
                          autoFocus
                          fullWidth
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      name="subtitle.dir"
                      control={control}
                      render={({ field }) => (
                        <DirectionRadio
                          label="Position"
                          id="cover-subtitle"
                          name="subtitleRadio"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FieldSet>
                  <FieldSet label="Rating" direction="column">
                    <Controller
                      name="star.count"
                      control={control}
                      render={({ field }) => (
                        <SliderInput
                          label="Rating"
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          max={5}
                          step={0.5}
                        />
                      )}
                    />
                    <Controller
                      name="star.dir"
                      control={control}
                      render={({ field }) => (
                        <DirectionRadio
                          label="Position"
                          id="star-rating"
                          name="starRadio"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FieldSet>
                  <FieldSet
                    direction="column"
                    label="Position"
                    gap={SPACING_GAP / 2}
                    flexWrap="nowrap">
                    <Controller
                      name="x"
                      control={control}
                      render={({ field }) => (
                        <SliderInput
                          label="X"
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          max={
                            isLandscape
                              ? dragLimits.width - dragLimits.x
                              : dragLimits.width - dragLimits.x - coverSizeWidth
                          }
                        />
                      )}
                    />
                    <Controller
                      name="y"
                      control={control}
                      render={({ field }) => (
                        <SliderInput
                          label="X"
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          max={
                            isLandscape
                              ? dragLimits.height - coverSizeHeight
                              : dragLimits.height +
                                dragLimits.y -
                                2 * coverSizeHeight
                          }
                        />
                      )}
                    />
                  </FieldSet>
                  {cover.link && (
                    <FieldSet
                      direction="row"
                      label="Image Link"
                      gap={SPACING_GAP / 2}
                      flexWrap="nowrap">
                      <TextField
                        fullWidth
                        disabled
                        label="Link"
                        value={cover.link}
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        type="button"
                        onClick={() =>
                          updateCover(cover.id, {
                            link: '',
                          })
                        }>
                        Delete
                      </Button>
                    </FieldSet>
                  )}
                </Stack>
              ),
            },
            {
              label: 'Connections',
              value: 'connections',
              component: (
                <CoverConnections coverId={cover.id} onChange={onChange} />
              ),
            },
          ]}
        />
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            variant="outlined"
            color="error"
            type="button"
            startIcon={<DeleteOutline />}
            onClick={handleDelete}>
            Delete
          </Button>
          <Button
            disabled={!isDirty}
            variant="outlined"
            color="secondary"
            type="button"
            startIcon={<RefreshOutlined />}
            onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<SearchOutlined />}
            onClick={handleSearchAgain}>
            Search
          </Button>
          <Button
            disabled={!isDirty}
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SaveOutlined />}>
            Save
          </Button>
        </Stack>
      }
      onSubmit={onSubmit}
    />
  );
};
