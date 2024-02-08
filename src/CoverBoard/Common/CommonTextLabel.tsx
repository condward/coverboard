import { Rect, Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import { CommonTextLabelPopover } from '.';
import { PosTypes, buildTitle } from 'types';
import { useMainStore } from 'store';
import { RefObject, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { getAlign } from 'utils';

interface TitleTexProps {
  label: string;
  setLabel: (title: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  x: number;
  y: number;
  width: number;
  dir: PosTypes;
  labelSize?: number;
  onReset: () => void;
  hasReset?: boolean;
  title?: string;
  editable?: boolean;
  wrap?: 'word' | 'char' | 'none';
  fontStyle?: 'bold';
  color: string;
}

export const CommonTextLabel: React.FC<TitleTexProps> = ({
  label,
  setLabel,
  x,
  y,
  dir,
  width,
  open,
  setOpen,
  labelSize = 1,
  onReset,
  hasReset = false,
  editable = true,
  wrap = 'none',
  title,
  color,
  fontStyle,
}) => {
  const fontSize = useMainStore((state) => state.fontSize());
  const backColor = useMainStore((state) => state.getBackColor());
  const textRef: RefObject<Konva.Text> = useRef(null);
  const [textWidth, setTextWidth] = useState(0);
  const saveId = useMainStore((state) => state.saveId);
  const align = getAlign(dir);

  const handleSubmit = (text: string) => {
    setOpen(false);
    setLabel(text);
  };

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getTextWidth());
    }
  }, [textRef, label, fontSize]);

  const getXTextPos = () => {
    if (align === 'left') {
      return x;
    } else if (align === 'right') {
      return x + width - textWidth;
    }
    return x + width / 2 - textWidth / 2;
  };

  const removedLabel =
    open &&
    (label === '<add title>' ||
      label === '<add text>' ||
      label === buildTitle(saveId))
      ? ''
      : label;

  return (
    <>
      {!open && (
        <>
          <Rect
            onClick={editable ? () => setOpen(true) : undefined}
            onTap={editable ? () => setOpen(true) : undefined}
            x={getXTextPos()}
            y={y}
            fill={backColor}
            width={textWidth}
            height={fontSize * labelSize}
          />
          <Text
            ref={textRef}
            listening={false}
            align={align}
            text={removedLabel}
            fontStyle={fontStyle}
            x={x}
            y={y}
            wrap={wrap}
            ellipsis={true}
            width={width}
            fontSize={fontSize * labelSize}
            fill={color}
          />
        </>
      )}
      {open && editable && (
        <Html>
          <CommonTextLabelPopover
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            defaultText={removedLabel}
            onReset={() => {
              onReset();
              setOpen(false);
            }}
            hasReset={hasReset}
            title={title}
            x={x}
            y={y}
            width={width}
            align={align}
            fontSize={fontSize * labelSize}
            fill={color}
            fillBack={backColor}
          />
        </Html>
      )}
    </>
  );
};
