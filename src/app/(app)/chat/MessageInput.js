import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import { IconButton, Stack } from '@mui/joy';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Upload } from '@mui/icons-material';

function MessageInputDecorator({ onSubmit }) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexGrow: 1,
        py: 1,
        pr: 1,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <div>
        <IconButton size="sm" variant="plain" color="neutral">
          <Upload />
        </IconButton>
      </div>
      <Button
        type="submit"
        size="sm"
        color="primary"
        sx={{ alignSelf: 'right', borderRadius: 'sm' }}
        endDecorator={<SendRoundedIcon />}
      >
        Send
      </Button>
    </Stack>
  );
}

const MemoizedDecorator = React.memo(MessageInputDecorator);

function MessageInput({ textAreaValue, setTextAreaValue, onSubmit }) {
  const textAreaRef = React.useRef(null);

  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();
    if (textAreaValue.trim() !== '') {
      onSubmit();
      setTextAreaValue('');
    }
  }, [textAreaValue, onSubmit, setTextAreaValue]);

  const handleKeyDown = React.useCallback((event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  }, [handleSubmit]);

  const handleChange = React.useCallback((event) => {
    setTextAreaValue(event.target.value);
  }, [setTextAreaValue]);

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl component="form" onSubmit={handleSubmit}>
        <Textarea
          placeholder="Type something here…"
          aria-label="Message"
          ref={textAreaRef}
          onChange={handleChange}
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          endDecorator={<MemoizedDecorator onSubmit={handleSubmit} />}
          onKeyDown={handleKeyDown}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
    </Box>
  );
}

export default React.memo(MessageInput);