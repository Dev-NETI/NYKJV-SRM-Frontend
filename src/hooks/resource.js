import axios from "@/lib/axios";

/**
 * Create a new resource.
 *
 * @param {*} { baseURL, route }
 * @return {*}
 */
const useResource = ({ route }) => {
  /**
   * Fetch all records from the resource.
   *
   * @return {*}
   */

  const index = (params = {}) => axios.get(`${route}`, { params });

  /**
   * Fetch a single record from the resource.
   *
   * @param {*} id
   * @return {*}
   */
  const show = (id) => axios.get(`${route}/${id}`);

  const showWithSlug = (slug) => axios.get(`${route}/${slug}`);

  const showWith2Parameter = (param1, param2) =>
    axios.get(`${route}/${param1}/${param2}`);

  const showWith3Parameter = (param1, param2, param3) =>
    axios.get(`${route}/${param1}/${param2}/${param3}`);

  /**
   * Store a new record in the resource.
   *
   * @param {*} payload
   * @return {*}
   */
  const store = (payload) => axios.post(`${route}`, payload);

  /**
   * Update a record in the resource.
   *
   * @param {*} id
   * @param {*} payload
   * @return {*}
   */
  const update = (id, payload) => axios.put(`${route}/${id}`, payload);

  const patch = (id, payload) => axios.patch(`${route}/${id}`, payload);

  const patchNoPayload = (id) => axios.patch(`${route}/${id}`);
  const patchNoPayloadW2Param = (id, id2) =>
    axios.patch(`${route}/${id}/${id2}`);

  /**
   * Delete a record from the resource.
   *
   * @param {*} id
   * @return {*}
   */
  const destroy = (id) => axios.delete(`${route}/${id}`);

  const destroy2Parameter = (id, id2) => axios.delete(`${route}/${id}/${id2}`);

  return {
    index,
    show,
    showWith2Parameter,
    store,
    update,
    destroy,
    patch,
    showWith3Parameter,
    destroy2Parameter,
    patchNoPayload,
    showWithSlug,
    patchNoPayloadW2Param,
  };
};

export { useResource };
