import { Box, Button, useDisclosure } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { useIsWagmiConnected } from "../../hooks/useIsWagmiConnected";
import { ConnectWallet } from "../ConnectWallet";
import { Modal } from "../Modal";

export interface ConnectWalletWrapperProps {
  children: React.ReactNode;
  variant?: "outline";
}

export const ConnectWalletWrapper: React.FC<ConnectWalletWrapperProps> = ({ children, variant }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isWagmiConnected } = useIsWagmiConnected();

  return (
    <Box>
      {!isWagmiConnected && (
        <Box>
          <Button
            width="full"
            variant={variant}
            rounded={config.styles.button.rounded}
            size={config.styles.button.size}
            fontSize={config.styles.button.fontSize}
            color={config.styles.text.color.primary}
            onClick={onOpen}
          >
            Connect Wallet
          </Button>
        </Box>
      )}
      {isWagmiConnected && <Box>{children}</Box>}
      <Modal onClose={onClose} isOpen={isOpen} header="Connect Wallet">
        <ConnectWallet callback={onClose} />
      </Modal>
    </Box>
  );
};
