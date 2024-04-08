import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const Modal = props => {
  const { isOpen, close, children, afterLeave = () => {}, classNameDialogPane } = props
  const cancelButtonRef = useRef(null)

  return (
    <Transition appear show={isOpen} as={Fragment} afterLeave={afterLeave}>
      <Dialog
        as="div"
        initialFocus={cancelButtonRef}
        className="relative !z-[1000]"
        onClose={close}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto" ref={cancelButtonRef}>
          <div className="flex min-h-full items-center justify-center px-4 sm:px-10 md:px-20 py-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`rounded w-full max-w-xl h-full transform text-left align-middle transition-all ${classNameDialogPane}`}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
