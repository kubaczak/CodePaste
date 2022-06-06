import React from 'react';

export default function Login() {
  return (
    <div className="form-control justify-center grid border-slate-700">
      <label className="input">
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
      </label>
    </div>
  );
}
