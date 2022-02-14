interface contractConfig {
  contractAddress: string;
  chainId: number;
}
const getContract = (
  contractConfigs: Array<contractConfig>,
  chainId: number
) => {
  const contract = contractConfigs.filter((e) => e.chainId === chainId);
  if (contract.length > 0) {
    return contract[0];
  } else {
    return false;
  }
};

export { getContract };
