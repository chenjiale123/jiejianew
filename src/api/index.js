
export function getAllLeaf(data) {
  let result = [];
  function getLeaf(data) {
    data.forEach(item => {
      if (!item.children) {
        result.push(item.id);
      } else {
        getLeaf(item.submenu);
      }
    });
  }
  getLeaf(data);
  console.log(result);
  return result;
}

export function collectId(arr, ids = []) {
  arr.forEach(({ id, submenu }) => {
    if (id) {
      ids.push(id);
    }
    if (submenu) {
      collectId(submenu, ids);
    }
  });
  return ids;
}
