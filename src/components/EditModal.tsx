import { useState } from "react";
import {
  ExclamationCircleIcon,
  CameraIcon,
  CheckIcon,
} from "@heroicons/react/16/solid";
import fruitIcon from "@/utils/fruitIcon";
import AddMap from "./AddMap";
import useFruits from "@/hooks/useFruits";
import useEditFruit from "@/hooks/useEditFruit";
import { Fruit, FruitLocationDetail } from "@/types";

export default function EditModal({ token, tree, onEdit, onClose }) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [oldTree, setOldTree] = useState<FruitLocationDetail | null>(tree);
  const [fruits, loading] = useFruits();
  const [fruitType, setFruitType] = useState<Fruit>();
  const [editFruit, saving, error] = useEditFruit();
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState<string | null>();

  async function saveFruit() {
    let fruitToPut = fruitType ? fruitType : {id: oldTree.fruit_id, name: oldTree.fruit};
    let latToPut = latitude ? latitude : oldTree.latitude;
    let lngToPut = longitude ? longitude: oldTree.longitude;
    let notesToPut = notes ? notes : oldTree.description;

    editFruit(oldTree.id, fruitToPut, latToPut, lngToPut, notesToPut, file);
    onEdit();
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
        <h3 className="font-bold text-lg mb-4">Edit Fruit</h3>
        {error ? (
          <div role="alert" className="alert alert-error mb-4">
            <ExclamationCircleIcon className="h-6 w-6" />
            <span>Error! Unable to edit fruit.</span>
          </div>
        ) : (
          <></>
        )}

        <AddMap
          fruit={fruitType?.name}
          latitude={latitude ? latitude: oldTree.latitude}
          longitude={longitude? longitude: oldTree.longitude}
          token={token}
          onClick={(lt, ln) => {
            setLatitude(lt);
            setLongitude(ln);
          }}
        />
        <select
          disabled={loading}
          className="select select-bordered select-lg w-full mt-3"
          value={fruitType?.id}
          onChange={(e) => {
            const fruit = fruits.find((f) => f.id === parseInt(e.target.value));
            setFruitType(fruit);
          }}
        >
          {fruits.map((fruit: Fruit) => {
              if(oldTree.fruit === fruit.name) {
                return (
                  <option key={fruit.id} value={fruit.id} selected>
                    {fruitIcon(fruit.name)} {fruit.name}
                  </option>
                )
              } else {
                return (
                  <option key={fruit.id} value={fruit.id}>
                    {fruitIcon(fruit.name)} {fruit.name}
                  </option>
                )
              }
          })}
        </select>
        <textarea
          className="textarea textarea-bordered w-full mt-3"
          maxLength={1000}
          onChange={(e) => setNotes(e.target.value)}
          defaultValue={oldTree.description}
        ></textarea>
        <div className="mt-3 flex justify-center">
          <input
            className="hidden"
            id="file"
            type="file"
            capture="environment"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setFile(files[0]);
              }
            }}
            accept="image/*"
          />
          <button
            className={`btn rounded-full btn-lg ${
              file ? "btn-success" : "btn-primary"
            } px-4`}
            onClick={() => {
              document.getElementById("file").click();
            }}
          >
            {file ? (
              <CheckIcon className="w-8 h-8" />
            ) : (
              <CameraIcon className="w-8 h-8" />
            )}
            {file ? "Change Photo" : "Update Photo"}
          </button>
        </div>
        <div className="modal-action">
          <button
            className="btn btn-primary"
            disabled={saving}
            onClick={() => {
              saveFruit();
            }}
          >
            {saving ? "Saving..." : "Edit"}
          </button>
          <button className="btn btn-outline" onClick={() => onClose()}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}
