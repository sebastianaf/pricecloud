import datetime


def serialize(obj, exclude_keys=None, depth=0, max_depth=3):
    if exclude_keys is None:
        exclude_keys = []

    if depth > max_depth:
        return str(obj)

    if isinstance(obj, (datetime.datetime, datetime.date, datetime.time)):
        return obj.isoformat()
    elif isinstance(obj, (str, int, float, bool, type(None))):
        return obj
    elif isinstance(obj, dict):
        return {k: serialize(v, exclude_keys, depth + 1, max_depth) for k, v in obj.items() if k not in exclude_keys}
    elif isinstance(obj, list):
        return [serialize(v, exclude_keys, depth + 1, max_depth) for v in obj]
    else:
        return {
            k: serialize(getattr(obj, k), exclude_keys, depth + 1, max_depth)
            for k in dir(obj)
            if not k.startswith('_') and not callable(getattr(obj, k)) and k not in exclude_keys
        }
