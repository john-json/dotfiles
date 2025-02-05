__all__ = ["crashlog", "crashlog_scripted_process", "heap"]
for x in __all__:
  __import__('lldb.macosx.' + x)

def __lldb_init_module(debugger, internal_dict):
  import lldb
  for x in __all__:
    submodule = getattr(lldb.macosx, x)
    lldb_init = getattr(submodule, '__lldb_init_module', None)
    if lldb_init:
      lldb_init(debugger, internal_dict)
