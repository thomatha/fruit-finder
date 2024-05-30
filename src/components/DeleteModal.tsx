import { useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import useDeleteFruit from '@/hooks/useDeleteFruit';
import { FruitLocationDetail } from '@/types';

export default function EditModal({ tree, onDelete, onClose }) {
  const [oldTree, setOldTree] = useState<FruitLocationDetail | null>(tree);
  const [deleteFruit, saving, error] = useDeleteFruit();

  async function removeFruit() {
    deleteFruit(oldTree.id);
    onDelete();
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => onClose()}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-4">Delete Fruit</h3>
        {error ? (
          <div role="alert" className="alert alert-error mb-4">
            <ExclamationCircleIcon className="h-6 w-6" />
            <span>Error! Unable to delete fruit.</span>
          </div>
        ) : (
          <></>
        )}
        <div>
          <span>
            Are you <strong>sure</strong> you want to delete this fruit tree
            location?
          </span>
          <br />
          <span>Once deleted, it cannot be recovered.</span>
        </div>
        <div className="modal-action">
          <button
            className="btn focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300"
            disabled={saving}
            onClick={() => {
              removeFruit();
            }}
          >
            {saving ? 'Deleting...' : 'Delete'}
          </button>
          <button className="btn btn-outline" onClick={() => onClose()}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}
