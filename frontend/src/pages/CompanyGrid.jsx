import BlogDemo from "../components/BlogDemo";
import Navbar from "../components/navbar.tsx";
import CardGrid from "../components/CardGrid";

import {
  ButtonGroup,
  ButtonGroupItem,
} from "../components/base/button-group/button-group";

export default function CompanyGrid() {
  return (
    <>
      <Navbar />
      <ButtonGroup />
      <CardGrid />
      <ButtonGroup selectedKeys={[]}>
        <ButtonGroupItem id="archive">Archive</ButtonGroupItem>
        <ButtonGroupItem id="edit">Edit</ButtonGroupItem>
        <ButtonGroupItem id="delete">Delete</ButtonGroupItem>
      </ButtonGroup>
      <BlogDemo />
    </>
  );
}
