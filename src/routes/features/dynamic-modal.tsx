import {
  Button,
  CloseButton,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/features/dynamic-modal")({
  component: DynamicModal,
});

function DynamicModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <main className="m-4">
      <Button
        onClick={open}
        className="rounded-md bg-black/20 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        Open dialog
      </Button>

      <Dialog
        open={isOpen}
        onClose={close}
        transition
        className="relative z-50 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 w-screen overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            {/* The actual dialog panel  */}
            <DialogPanel className="w-full min-h-[calc(100vh-2rem)] max-w-7xl space-y-4 bg-white rounded-lg">
              {/* Head banner */}
              <div className="flex items-center justify-between h-12 rounded-t-lg relative px-2">
                <div className="gap-2 flex flex-row flex-nowrap flex-grow justify-center">
                  <DialogTitle className="font-bold">
                    Modal's title
                    <b aria-hidden>:</b>
                  </DialogTitle>

                  <Description className="opacity-75">
                    This will permanently deactivate your account
                  </Description>
                </div>
                <CloseButton
                  data-autofocus
                  className="h-8 w-8 rounded-full bg-transparent hover:bg-gray-600 "
                >
                  X
                </CloseButton>
              </div>

              {/* Cover */}
              <div className="aspect-video relative">
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-25% from-neutral-900 to-transparent" />
              </div>

              <p>
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed.
              </p>
              <div className="flex gap-4">
                <button onClick={close}>Cancel</button>
                <button onClick={close} data-autofocus>
                  Deactivate
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
