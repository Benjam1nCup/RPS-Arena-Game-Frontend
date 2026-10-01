"use client";

import { BuyRPSForm } from "@/components/buy/BuyRPSForm";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppProvider";

export function BuyRPSModal() {
  const { buyModalOpen, closeBuyModal } = useApp();
  return (
    <Modal open={buyModalOpen} onClose={closeBuyModal} title="Buy RPS">
      <BuyRPSForm onDone={closeBuyModal} inModal />
    </Modal>
  );
}
