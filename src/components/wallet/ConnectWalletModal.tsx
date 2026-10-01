"use client";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { Spinner } from "@/components/common/Spinner";
import { useApp } from "@/context/AppProvider";
import { shortenAddress } from "@/lib/utils";

export function ConnectWalletModal() {
  const {
    connectModalOpen,
    closeConnectModal,
    walletPhase,
    connectWallet,
    switchNetwork,
    wallet,
  } = useApp();

  return (
    <Modal
      open={connectModalOpen}
      onClose={closeConnectModal}
      title="Connect wallet"
    >
      {walletPhase === "idle" || walletPhase === "failed" ? (
        <div className="space-y-4">
          <p className="text-text-secondary">Connect your wallet to play.</p>
          {walletPhase === "failed" ? (
            <p className="text-sm text-danger">Unable to connect. Try again.</p>
          ) : null}
          <Button fullWidth onClick={() => void connectWallet()}>
            Connect wallet
          </Button>
        </div>
      ) : null}

      {walletPhase === "connecting" ? (
        <div className="flex flex-col items-center gap-3 py-6 text-text-secondary">
          <Spinner className="h-8 w-8" />
          <p>Connecting to your wallet…</p>
        </div>
      ) : null}

      {walletPhase === "connected" && wallet ? (
        <div className="space-y-4">
          <p className="text-center text-sm uppercase tracking-wider text-success">
            Wallet connected
          </p>
          <p className="text-center font-mono text-lg">{shortenAddress(wallet.address)}</p>
          <Button fullWidth onClick={closeConnectModal}>
            Continue
          </Button>
        </div>
      ) : null}

      {walletPhase === "wrong_network" ? (
        <div className="space-y-4">
          <p className="text-text-secondary">
            RPS Arena requires Robinhood Chain.
          </p>
          <Button fullWidth onClick={() => void switchNetwork()}>
            Switch network
          </Button>
        </div>
      ) : null}
    </Modal>
  );
}
