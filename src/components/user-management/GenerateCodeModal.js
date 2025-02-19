import axios from "@/lib/axios";
import { Security, ContentCopy } from "@mui/icons-material";
import { Button, ModalDialog, Typography, Box, IconButton } from "@mui/joy";
import { Modal } from "@mui/material";
import React, { useState, useEffect } from "react";

function GenerateCodeModal() {
  const [openGenerateCodeModal, setOpenGenerateCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const generateRandomCode = () => {
    // Generate a random 6-digit number
    const code = Math.floor(100000 + Math.random() * 900000);
    setGeneratedCode(code.toString());

    const response = axios.post("/api/register-code/generate", {
      code: code,
    });

    console.log(response);
  };

  const handleOpenGenerateCodeModal = () => {
    setOpenGenerateCodeModal(true);
    generateRandomCode();
  };

  const handleCloseGenerateCodeModal = () => {
    setOpenGenerateCodeModal(false);
    setCopySuccess(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopySuccess(true);

      // Reset copy success message after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <React.Fragment>
      <Button
        startDecorator={<Security />}
        variant="soft"
        onClick={handleOpenGenerateCodeModal}
      >
        Generate Code
      </Button>
      <Modal
        open={openGenerateCodeModal}
        onClose={handleCloseGenerateCodeModal}
        aria-labelledby="generate-code-modal"
        aria-describedby="modal-to-generate-code"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ModalDialog
          sx={{
            minWidth: 300,
            maxWidth: 400,
            p: 3,
            borderRadius: "md",
            textAlign: "center",
          }}
        >
          <Typography level="h4" mb={1}>
            Generated Code
          </Typography>

          <Typography level="body-md">
            Please copy the code below and use it to add a new user.
          </Typography>

          <Box
            sx={{
              bgcolor: "background.level1",
              p: 3,
              borderRadius: "md",
              mb: 2,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Typography
              level="h3"
              sx={{
                letterSpacing: "0.25em",
                fontFamily: "monospace",
              }}
            >
              {generatedCode}
            </Typography>
            <IconButton
              variant="soft"
              color="primary"
              onClick={handleCopyCode}
              title="Copy to clipboard"
            >
              <ContentCopy />
            </IconButton>
          </Box>

          {copySuccess && (
            <Typography level="body-sm" color="success" mb={2}>
              Code copied to clipboard!
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <Button
              variant="solid"
              color="primary"
              onClick={generateRandomCode}
            >
              Generate New Code
            </Button>
            <Button
              variant="soft"
              color="neutral"
              onClick={handleCloseGenerateCodeModal}
            >
              Close
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

export default GenerateCodeModal;
