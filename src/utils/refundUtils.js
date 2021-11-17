import QRious from 'qrious';

export const createRefundQr = (
  currency,
  privateKey,
  redeemScript,
  timeoutBlockHeight,
  swapInfo,
  swapResponse
) => {
  const jsonData = JSON.stringify({
    currency,
    privateKey,
    redeemScript,
    timeoutBlockHeight,
    swapInfo,
    swapResponse,
  });

  console.log('createRefundQr jsonData: ', jsonData);

  const qr = new QRious({
    size: 500,
    level: 'L',
    value: jsonData,
    background: 'white',
    foreground: 'black',
    backgroundAlpha: 1,
    foregroundAlpha: 1,
  });

  return qr.toDataURL();
};
