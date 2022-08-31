import { Box, ButtonGroup, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import React from "react";

import config from "../../../config.json";
import { LinkKey } from "../../types/confg";
import { icons } from "./data";

export const Footer: React.FC = () => {
  return (
    <Box px="4" py="2" as="footer">
      <Stack justify="space-between" direction="row" align="center">
        <Link href="https://www.nfthashi.com/" target={"_blank"}>
          <Text fontSize="xs" color={config.styles.text.color.secondary}>
            {config.app.name}
          </Text>
        </Link>
        <ButtonGroup variant={"ghost"}>
          {Object.entries(config.links).map(([key, link]) => (
            <IconButton
              key={key}
              as="a"
              href={link.uri}
              target="_blank"
              aria-label={key}
              icon={icons[key as LinkKey]}
            />
          ))}
        </ButtonGroup>
      </Stack>
    </Box>
  );
};
