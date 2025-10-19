import { React, useEffect, useState } from "react";
import { Dropdown, Avatar } from "antd";
import { useDispatch } from "react-redux";
import { LogoutOutlined } from "@ant-design/icons";
import NavItem from "./NavItem";
import Flex from "components/shared-components/Flex";
import { signOut } from "store/slices/authSlice";
import styled from "@emotion/styled";
import {
  FONT_WEIGHT,
  MEDIA_QUERIES,
  SPACER,
  FONT_SIZES,
} from "constants/ThemeConstant";

const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}));

const Profile = styled.div(() => ({
  display: "flex",
  alignItems: "center",
}));

const UserInfo = styled("div")`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`;

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD,
}));

const Title = styled.span(() => ({
  opacity: 0.8,
}));
const MenuItemSignOut = (props) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  );
};

const items = [
  {
    key: "Sign Out",
    label: <MenuItemSignOut label="Sign Out" />,
  },
];

export const NavProfile = ({ mode }) => {
  const [username, setUsernamr] = useState([]);
  const [role, setRole] = useState([]);

  useEffect(() => {
    const getUsername = () => {
      const userDetails = localStorage.getItem("userDetails");
      const username = JSON.parse(userDetails).name;
      //   const role = JSON.parse(userDetails).role;

      setUsernamr(username);
      setRole(role);
    };
    getUsername();
  }, []);
  const initials = `${username[0]}`;

  return (
    <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
      <NavItem mode={mode}>
        <Profile>
          <Avatar>{initials}</Avatar> {/* Use initials instead of the image */}
          <UserInfo className="profile-text">
            <Name>{username}</Name>
            {/* <Title>{role}</Title> */}
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  );
};

export default NavProfile;
