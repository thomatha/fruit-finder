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

export default function EditModal({ token, lat, lng, onClose, onEdit, tree }) {
  const [fruitType, setFruitType] = useState<Fruit>();
  const [latitude, setLatitude] = useState(lat);
  const [longitude, setLongitude] = useState(lng);
  const [oldTree, setOldTree] = useState<FruitLocationDetail | null>(tree);
  const [fruits, loading] = useFruits();
  const [editFruit, saving, error] = useEditFruit();
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState<string | null>();
  const [updateLocation, setUpdateLocation] = useState(false);

  async function saveFruit() {
    await editFruit(oldTree.id, fruitType, latitude, longitude, notes, file);
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
          latitude={latitude}
          longitude={longitude}
          token={token}
          onClick={(lt, ln) => {
            if(updateLocation) {
              setLatitude(lt);
              setLongitude(ln);
            }
          }}
        />
          <input type='radio' id='update-loc' name='loc-choice' defaultChecked onClick={() => {
            setUpdateLocation(true);
          }} />
          <label htmlFor='update-loc'>{' '}Update Location</label><br/>
          <input type='radio' id='keep-loc' name='loc-choice' className="mt-2" onClick={() => {
            setLatitude(oldTree.latitude);
            setLongitude(oldTree.longitude);
            setUpdateLocation(false);
          }} />
          <label htmlFor='keep-loc'>{' '}Keep Location</label>
        <select
          disabled={loading}
          className="select select-bordered select-lg w-full mt-3"
          value={fruitType?.id}
          onChange={(e) => {
            const fruit = fruits.find((f) => f.id == parseInt(e.target.value));
            setFruitType(fruit);
          }}
        >
          {/*TODO: Pre-populate this selector with the selected tree's assigned fruit*/}
          <option disabled selected>
            What type of fruit?
          </option>
          {fruits.map((fruit: Fruit) => (
            <option key={fruit.id} value={fruit.id}>
              {fruitIcon(fruit.name)} {fruit.name}
            </option>
          ))}
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
            disabled={!fruitType || saving}
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
