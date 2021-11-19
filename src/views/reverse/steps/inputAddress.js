import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { address } from 'bitcoinjs-lib';
import View from '../../../components/view';
import InputArea from '../../../components/inputarea';
import {
  getCurrencyName,
  getSampleAddress,
  getNetwork,
  connectWallet,
} from '../../../utils';
import Button from '../../../components/button';
// import { FaWallet } from 'react-icons/fa';

const inputAddressStyles = () => ({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '30px',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
    textAlign: 'center',
    marginBlockEnd: '0',
  },
  contractButton: {
    background: 'black',
    margin: '4px',
    borderRadius: '5px',
  },
});

class StyledInputAddress extends React.Component {
  state = {
    error: false,
  };

  onChange = input => {
    const { onChange, swapInfo } = this.props;
    const swapAddress = input.trim();
    // .toLowerCase()

    let error = true;

    if (input !== '') {
      try {
        address.toOutputScript(swapAddress, getNetwork(swapInfo.quote));
        error = false;
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }

    // console.log('inputaddress setstate ', swapAddress, error, onChange);
    this.setState({ error });
    onChange(swapAddress, error);
  };

  render() {
    const { error } = this.state;
    const { classes, swapInfo } = this.props;

    return (
      <View className={classes.wrapper}>
        <p className={classes.title}>
          Paste or scan a <b>{getCurrencyName(swapInfo.quote)}</b> address to
          which you want to receive <br /> {'OR'}
        </p>
        <Button
          className={classes.contractButton}
          text={'Connect Wallet'}
          // error={error || inputError}
          onPress={async () => {
            let w3 = await connectWallet();
            console.log('onpress account ', w3);
            this.onChange(w3.account, false);
            // document.getElementById('inputAddressia').value = account;
            document.getElementsByTagName('textarea')[0].value = w3.account;
          }}
          // errorText={errorMessage}
        >
          {/* <FaWallet size={25} color="#FFFF00" /> */}
        </Button>
        <InputArea
          width={600}
          autoFocus={true}
          height={150}
          error={error}
          showQrScanner={true}
          onChange={this.onChange}
          placeholder={`EG: ${getSampleAddress(swapInfo.quote)}`}
        />
      </View>
    );
  }
}

StyledInputAddress.propTypes = {
  classes: PropTypes.object.isRequired,
  swapInfo: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

const InputAddress = injectSheet(inputAddressStyles)(StyledInputAddress);

export default InputAddress;
