import type { CSSProperties } from "react";

interface Props {
  text: string;
  className?: string;
}

const CIPHER_CHARACTERS = ["0", "1", "+", "×", "∆", "◇", "?"];

export function DecryptedText({ text, className = "" }: Props) {
  const classes = ["decrypted-text", className].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-label={text}>
      {Array.from(text).map((character, index) => {
        const style = { "--decrypt-delay": `${index * 34}ms` } as CSSProperties;

        return (
          <span
            className="decrypted-text__character"
            data-cipher={
              character === " "
                ? ""
                : CIPHER_CHARACTERS[index % CIPHER_CHARACTERS.length]
            }
            style={style}
            aria-hidden="true"
            key={`${character}-${index}`}
          >
            <span className="decrypted-text__final">
              {character === " " ? "\u00a0" : character}
            </span>
          </span>
        );
      })}
    </span>
  );
}
