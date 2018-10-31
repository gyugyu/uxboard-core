export default (elem: Element | Text): elem is Element => {
  return elem.nodeType != null
}
