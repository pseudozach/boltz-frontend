import { connect } from 'react-redux';
import Refund from './refund';
import * as actions from '../../actions/refundActions';
// import { startRefund, dummyAction } from '../../actions/refundActions';

const mapStateToProps = state => ({
  refundFile: state.refundReducer.refundFile,
  transactionHash: state.refundReducer.transactionHash,
  destinationAddress: state.refundReducer.destinationAddress,
  refundTransactionHash: state.refundReducer.refundTransactionHash,
  isFetching: state.refundReducer.isFetching,
});

const mapDispatchToProps = dispatch => ({
  setRefundFile: file => dispatch(actions.setRefundFile(file)),
  setTransactionHash: hash => dispatch(actions.setTransactionHash(hash)),
  setDestinationAddress: address =>
    dispatch(actions.setDestinationAddress(address)),
  // startRefund: () => dispatch(actions.dummyAction),
  // return {
  //   startRefund: () => dispatch(fetchAppsData())
  // }
    // , cb
  startRefund: (refundFile, transactionHash, destinationAddress) =>
    // console.log('index.js ', dispatch, actions.startRefund),
    // dispatch(
      actions.startRefund(refundFile, transactionHash, destinationAddress),
      // (refundFile, transactionHash, destinationAddress)
    //   // , cb
    // ),
  completeRefund: () => dispatch(actions.completeRefund()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Refund);
