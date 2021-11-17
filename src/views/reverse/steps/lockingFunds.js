import React from 'react';
import Switch from 'react-switch';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Link from '../../../components/link';
import View from '../../../components/view';
import { getCurrencyName, getExplorer, claimFunds, claimTokens } from '../../../utils';
import Button from '../../../components/button';

const styles = () => ({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: '30px',
    paddingLeft: '20px',
    paddingRight: '20px',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  switch: {
    paddingLeft: '10px',
  },
  contractButton: {
    background: 'black',
    margin: '4px',
    borderRadius: '5px',
  },  
});

class LockingFunds extends React.Component {
  constructor() {
    super();

    this.state = {
      checked: false,
    };
  }

  render() {
    const { classes, swapInfo, swapResponse, setAllowZeroConf, swapStatus } = this.props;

    const link = swapResponse
      ? `${getExplorer(swapInfo.quote)}/tx/${swapResponse.transactionId}`
      : '#0';

    return (
      <View className={classes.wrapper}>
        <p className={classes.text}>
          We are locking the <b>{getCurrencyName(swapInfo.quote)}</b> that you
          are ought to receive, this is important to keep the swap atomic and
          trustless. It might take up to 10 minutes.
          <br />
          <br />
          <Link to={link} text={'Click here'} /> to see the lockup transaction.
          <br />
          <br />
          {(swapInfo.quote === 'SOV' || swapInfo.quote === 'RBTC') && 
          (swapStatus !== 'Could not send onchain coins' && swapStatus !== 'Waiting for confirmation...') ? (
            <p className={classes.text}>
              Lockup is confirmed. 
              <br/>
              Tap here to trigger Claim Contract Call:{' '}
              {/* <button
                onClick={() => claimFunds(swapInfo, swapResponse)}
                // target={'_blank'}
                // href="https://litecoin-project.github.io/p2sh-convert/"
              >
                Claim
              </button> */}
              <Button
                className={classes.contractButton}
                text={'Claim'}
                // error={error || inputError}
                // onPress={() => claimFunds(swapInfo, swapResponse)}
                // onClick={() =>
                onPress={() =>
                  swapInfo.quote === 'RBTC'
                    ? claimFunds(swapInfo, swapResponse)
                    : claimTokens(swapInfo, swapResponse)
                }
                // errorText={errorMessage}
              />
            </p>
          ) : null}
          {/* If you are #reckless and impatient you can accept the 0-conf
          transaction:
          <Switch
            className={classes.switch}
            checked={this.state.checked}
            onChange={checked => {
              setAllowZeroConf(checked);
              this.setState({ checked });
            }}
            width={48}
            height={20}
            handleDiameter={30}
            checkedIcon={false}
            uncheckedIcon={false}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          /> */}
        </p>
      </View>
    );
  }
}

LockingFunds.propTypes = {
  swapInfo: PropTypes.object.isRequired,
  swapResponse: PropTypes.object.isRequired,
  setAllowZeroConf: PropTypes.func.isRequired,
  swapStatus: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(LockingFunds);
