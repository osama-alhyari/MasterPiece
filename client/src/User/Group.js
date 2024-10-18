import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Group() {
  const { id } = useParams();
  const [group, setGroup] = useState();

  async function fetchGroup() {
    const response = await axios.get(`http://127.0.0.1:8000/api/group/${id}`);
    setGroup(response.data.Group[0]);
  }

  useEffect(() => {
    fetchGroup();
  }, [id]);

  return (
    <>
      <h1 className="text-white">{group ? group.name : null}</h1>
      <h3 className="text-white">{group ? group.description : null}</h3>
      <h4 className="text-white">Products</h4>
      {group
        ? group.products.map((product) => {
            return <h6 className="text-white">{product.name}</h6>;
          })
        : null}
    </>
  );
}
