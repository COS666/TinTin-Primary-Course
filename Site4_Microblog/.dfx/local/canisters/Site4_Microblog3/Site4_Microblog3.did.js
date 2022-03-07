export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Message = IDL.Tuple(IDL.Text, Time);
  return IDL.Service({
    'follow' : IDL.Func([IDL.Principal], [], []),
    'follows' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'post' : IDL.Func([IDL.Text], [], []),
    'posts' : IDL.Func([Time], [IDL.Vec(Message)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
