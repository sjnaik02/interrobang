import React, { useState, useRef, useEffect } from "react";

type ClickToEditProps = {
  children: React.ReactNode;
  onSave?: (value: string) => void;
  className?: string;
  placeholder?: string;
};

const ClickToEdit: React.FC<ClickToEditProps> = ({
  children,
  onSave,
  className = "",
  placeholder = "Click to edit...",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Extract text content from children
    if (typeof children === "string") {
      setValue(children);
    } else if (React.isValidElement(children)) {
      setValue(String(children.props.children || ""));
    }
  }, [children]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
      textareaRef.current?.focus();
    }
  }, [isEditing, value]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      textareaRef.current?.blur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      if (typeof children === "string") {
        setValue(children);
      } else if (React.isValidElement(children)) {
        setValue(String(children.props.children || ""));
      }
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          adjustTextareaHeight();
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full resize-none overflow-hidden rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        rows={1}
      />
    );
  }

  const content = value || placeholder;
  const isEmpty = !value;

  return (
    <span
      onClick={handleClick}
      className={`block cursor-pointer whitespace-pre-wrap rounded px-2 py-1 hover:bg-gray-100 ${isEmpty ? "italic text-gray-400" : ""} ${className}`}
      role="button"
      tabIndex={0}
    >
      {content}
    </span>
  );
};

export default ClickToEdit;
