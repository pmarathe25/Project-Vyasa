import * as React from 'react';

interface OffsetAnchorProps {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// An anchor that is offset from its contents. This way, the anchor
// is not potentially hidden behind the top bar when the browser scrolls to it.
const OffsetAnchor = React.memo(function OffsetAnchor({ id, children, style }: OffsetAnchorProps) {
  return (
    <span
      id={id}
      style={{
        paddingTop: '70px',
        marginTop: '-70px',
        paddingLeft: '0px',
        paddingRight: '0px',
        marginLeft: '0px',
        marginRight: '0px',
        ...style,
      }}
    >
      {children}
    </span>
  );
});

export default OffsetAnchor;