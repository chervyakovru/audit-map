import React from 'react';
import CustomContextMenu from './CustomContextMenu';
import CustomContextMenuContext, { CustomContextMenuProps } from './CustomContextMenuContext';

class ViolationsWithContext extends React.Component {
  constructor(props) {
    super(props);

    this.setCustomContextMenuProps = ({ x, y, menuItems, isVisible }) => {
      this.setState(() => ({
        // eslint-disable-next-line react/no-unused-state
        customContextMenuProps: { x, y, menuItems, isVisible },
      }));
    };

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      customContextMenuProps: CustomContextMenuProps,
      // eslint-disable-next-line react/no-unused-state
      setCustomContextMenuProps: this.setCustomContextMenuProps,
    };
  }

  render() {
    const { children } = this.props;
    const { customContextMenuProps } = this.state;
    const { x, y, menuItems, isVisible } = customContextMenuProps;
    return (
      <CustomContextMenuContext.Provider value={this.state}>
        {children}
        {isVisible && <CustomContextMenu x={x} y={y} menuItems={menuItems} />}
      </CustomContextMenuContext.Provider>
    );
  }
}

export default ViolationsWithContext;
