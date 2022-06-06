import { useState } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  children?: React.ReactNode;
};

export default function Navbar({ children }: Props) {
  const [nick, setNick] = useState('kubaczak');

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to={'/'}>
          <a className="btn btn-ghost normal-case text-xl">CodePaste</a>
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src={`https://avatars.dicebear.com/api/adventurer/${nick}.svg`}
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
