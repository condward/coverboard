import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
} from 'react';
import { Button, FormLabel } from '@mui/material';
import { UploadOutlined } from '@mui/icons-material';

interface FileImporterProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  id: string;
  label: string;
  onFileRead?: (str: string) => void;
  helperText?: string;
}

const FileImporter: React.FC<FileImporterProps> = (props) => {
  const { onFileRead, required, helperText, ...restProps } = props;
  const { id, label, disabled } = restProps;

  const [fileName, setFileName] = useState('');
  const isError = !fileName && !!helperText;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          onFileRead?.(String(e.target.result));
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={handleChange}
        hidden
        required={required}
        {...restProps}
      />
      <FormLabel
        htmlFor={id}
        error={isError}
        disabled={disabled}
        aria-label={label}>
        <Button
          variant="outlined"
          color="secondary"
          component="span"
          startIcon={<UploadOutlined />}
          disabled={disabled}>
          {label}
        </Button>
      </FormLabel>
    </>
  );
};

export default FileImporter;
