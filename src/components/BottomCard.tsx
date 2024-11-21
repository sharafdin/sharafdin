"use client";

import { bottomCard } from "@/app/resources";
import { Background, Badge, Flex, Heading, Text } from "@/once-ui/components";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

type BottomCardContentProps = {
  display: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
};

export const BottomCard = ({ bottomCardContent }: { bottomCardContent: BottomCardContentProps }) => {
  return (
    <Flex
      style={{ overflow: "hidden" }}
      position="relative"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      direction="column"
      alignItems="center"
      align="center"
      justifyContent="center"
      background="surface"
      border="neutral-medium"
      borderStyle="solid-1"
    >
      <Background
        position="absolute"
        mask={bottomCard.effects.mask as any}
        gradient={bottomCard.effects.gradient as any}
        dots={bottomCard.effects.dots as any}
        lines={bottomCard.effects.lines as any}
      />
      <Heading
        style={{ position: "relative" }}
        marginBottom="s"
        variant="display-strong-xs"
      >
        {bottomCardContent.title}
      </Heading>
      <Text
        marginBottom="s"
        style={{
          position: "relative",
          maxWidth: "var(--responsive-width-xs)",
        }}
        wrap="balance"
        onBackground="neutral-medium"
      >
        {bottomCardContent.description}
      </Text>

      <Badge icon="openLink" arrow={false} effect href="/about">
        Explore
      </Badge>
    </Flex>
  );
};
