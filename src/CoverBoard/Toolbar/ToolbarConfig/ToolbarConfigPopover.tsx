import React, { useState } from 'react';
import {
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Slider,
  Typography,
  FormControl,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  SelectChangeEvent,
} from '@mui/material';
import {
  backColorMap,
  BackColors,
  colorMap,
  Colors,
  ColorSettings,
  ToolbarConfigParams,
  ToolbarConfigValues,
  ToolConfigIDs,
} from 'types';
import { CommonDialog, DirectionRadio } from 'components';
import { useMainStore } from 'store';
interface ToolbarConfigPopoverProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    config: ToolbarConfigParams,
    updatedParam?: ToolbarConfigValues,
  ) => void;
}

export const ToolbarConfigPopover: React.FC<ToolbarConfigPopoverProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const configs = useMainStore((state) => state.configs);
  const [param, setParams] = useState(configs);
  const titleLabel = useMainStore((state) => state.titleLabel().label);
  const subTitleLabel = useMainStore((state) => state.subTitleLabel().label);

  const handleNumberChange = (
    _: Event,
    value: number | number[],
    updatedParam: ToolbarConfigValues,
  ) => {
    if (Array.isArray(value)) return;
    const obj = { ...param, [updatedParam]: Number(value * 100) };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    updatedParam: ToolbarConfigValues,
  ) => {
    const obj = { ...param, [updatedParam]: event.target.value };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  const handleButtonChange = (
    event: SelectChangeEvent<string | number | boolean>,
    updatedParam: ToolbarConfigValues,
  ) => {
    const obj = {
      ...param,
      [updatedParam]: (event.target as HTMLButtonElement).value,
    };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    onClose();
  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    updatedParam: ToolbarConfigValues,
  ) => {
    const obj = { ...param, [updatedParam]: event.target.checked };
    setParams(obj);
    onSubmit(obj, updatedParam);
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Options"
      hash={ToolConfigIDs.CONFIG}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              label="Title"
              value={param[ToolbarConfigValues.TITLE]}
              onChange={(e) => handleChange(e, ToolbarConfigValues.TITLE)}
              style={{ marginBottom: '10px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Elements size:</Typography>
            <Slider
              min={0.5}
              max={1.5}
              step={0.1}
              valueLabelDisplay="on"
              defaultValue={param[ToolbarConfigValues.SIZE] / 100}
              value={param[ToolbarConfigValues.SIZE] / 100}
              onChange={(evt, value) =>
                handleNumberChange(evt, value, ToolbarConfigValues.SIZE)
              }
            />
          </Grid>
          <Grid item xs={12}>
            {ColorSettings.map((colorSetting) => (
              <FormControl sx={{ m: 1, minWidth: 120 }} key={colorSetting.name}>
                <InputLabel variant="outlined" htmlFor={colorSetting.name}>
                  {colorSetting.label}
                </InputLabel>
                <Select
                  labelId={colorSetting.name}
                  id={colorSetting.name}
                  label={colorSetting.label}
                  value={param[colorSetting.name]}
                  onChange={(evt) =>
                    handleButtonChange(evt, colorSetting.name)
                  }>
                  {Object.values(Colors).map((clr) => (
                    <MenuItem value={clr} key={clr}>
                      <Button
                        style={{
                          backgroundColor: colorMap[clr],
                          color: clr === 'yellow' ? 'gray' : 'white',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          height: '30px',
                          width: '25x',
                          margin: '0px 10px',
                          border:
                            clr === param[colorSetting.name]
                              ? '1px solid black'
                              : undefined,
                        }}>
                        {clr}
                      </Button>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel
                variant="outlined"
                htmlFor={ToolbarConfigValues.BACK_COLOR}>
                Back Color
              </InputLabel>
              <Select
                labelId={ToolbarConfigValues.BACK_COLOR}
                id={ToolbarConfigValues.BACK_COLOR}
                value={param[ToolbarConfigValues.BACK_COLOR]}
                label="Back Color"
                onChange={(evt) =>
                  handleButtonChange(evt, ToolbarConfigValues.BACK_COLOR)
                }>
                {Object.values(BackColors).map((clr) => (
                  <MenuItem value={clr} key={clr}>
                    <Button
                      style={{
                        backgroundColor: backColorMap[clr],
                        height: '30px',
                        width: '25x',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        margin: '0px 10px',
                        border:
                          clr === param[ToolbarConfigValues.BACK_COLOR]
                            ? '1px solid black'
                            : undefined,
                      }}>
                      {clr}
                    </Button>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_MAIN_TITLE]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_MAIN_TITLE)
                  }
                />
              }
              label="Show main title"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_TITLE]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_TITLE)
                  }
                />
              }
              label={`Show ${titleLabel} name`}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_SUBTITLE]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_SUBTITLE)
                  }
                />
              }
              label={`Show ${subTitleLabel} name`}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_ARROW]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_ARROW)
                  }
                />
              }
              label={`Show arrow labels`}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={param[ToolbarConfigValues.SHOW_STARS]}
                  onChange={(evt) =>
                    handleSwitchChange(evt, ToolbarConfigValues.SHOW_STARS)
                  }
                />
              }
              label={`Show rating stars`}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <label>Cover labels default position:</label>
              <DirectionRadio
                name="labelRadio"
                value={param[ToolbarConfigValues.LABEL_DIR]}
                onChange={(evt) =>
                  handleChange(evt, ToolbarConfigValues.LABEL_DIR)
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <label>Group labels default position:</label>
              <DirectionRadio
                name="groupRadio"
                value={param[ToolbarConfigValues.GROUP_DIR]}
                onChange={(evt) =>
                  handleChange(evt, ToolbarConfigValues.GROUP_DIR)
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <label>Rating stars default position:</label>
              <DirectionRadio
                name="starRadio"
                value={param[ToolbarConfigValues.STARS_DIR]}
                onChange={(evt) =>
                  handleChange(evt, ToolbarConfigValues.STARS_DIR)
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Close
            </Button>

            <Tooltip
              title={
                <>
                  <h3>Toolbar (no selections)</h3>
                  <p>A - open Search and add</p>
                  <p>O - open Options</p>
                  <p>S - open Share and save</p>
                  <p>G - create group</p>
                  <p>C - download image of board</p>
                  <p>U or CTRL+Z - undo</p>
                  <h3>Misc.</h3>
                  <p>E - edit title</p>
                  <p>N - next cover and group</p>
                  <p>P - prev cover or group</p>
                  <h3>When elem selected</h3>
                  <p>Delete - delete elem</p>
                  <p>Enter - open config popover</p>
                  <p>Esc - exit selection</p>
                  <p>ArrowKeys - select arrow direction</p>
                </>
              }>
              <Button
                variant="contained"
                color="secondary"
                type="button"
                style={{ marginRight: '20px', marginBottom: '20px' }}>
                Keyboard Shortcuts
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  );
};
