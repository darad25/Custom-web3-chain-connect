import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Chain, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, goerli, mainnet, optimism, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const pegasusChain: Chain = {
  id: 1891,
  name: 'Pegasus Testnet',
  network: 'Ethereum',
  nativeCurrency: {
    decimals: 18,
    name: 'Pegasus Testnet',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: {
      http: ['https://replicator-01.pegasus.lightlink.io/rpc/v1'],
    },
    default: {
      http: ['https://replicator-01.pegasus.lightlink.io/rpc/v1'],
    },
  },
  blockExplorers: {
    default: { name: 'SnTraowce', url: 'https://pegasus.lightlink.io ' },
    etherscan: { name: 'SnowTrace', url: 'https://pegasus.lightlink.io' },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    pegasusChain,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
