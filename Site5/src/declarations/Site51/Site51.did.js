export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Message = IDL.Tuple(IDL.Text, IDL.Text, Time);
  return IDL.Service({
    'follow' : IDL.Func([IDL.Text, IDL.Principal], [], []),
    'follows' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'get_name' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'post' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'posts' : IDL.Func([Time], [IDL.Vec(Message)], ['query']),
    'set_name' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'timeline' : IDL.Func([Time], [IDL.Vec(Message)], []),
  });
};
export const init = ({ IDL }) => { return []; };
