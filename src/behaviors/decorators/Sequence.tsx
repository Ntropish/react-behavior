import React from "react";

import { BehaviorNodeProps, BehaviorNodeRenderer } from "../../types";

interface SequenceProps extends BehaviorNodeProps<void, void> {
  children: BehaviorNodeRenderer[];
}

const SequenceDecorator: React.FC<SequenceProps> = ({
  onSuccess,
  onError,
  children,
}) => {
  const [current, setCurrent] = React.useState(0);

  const handleChildSuccess = () => {
    if (current < children.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      onSuccess?.();
    }
  };

  const handleChildError = (error: unknown) => {
    console.log("Error in sequence");
    console.error(error);
    onError?.();
  };

  // Prepare the props that will be injected into the current child.
  const injectedProps: BehaviorNodeProps = {
    onSuccess: handleChildSuccess,
    onError: handleChildError,
  };

  return children[current](injectedProps);
};

export default SequenceDecorator;
