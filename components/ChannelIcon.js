const ChannelIcon = ({ icon }) => {
    const style = {
      backgroundImage: `url(${icon})`,
      backgroundSize: '36px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '36px',
      height: '36px',
    }
    return <div style={style} />;
}

export default ChannelIcon
