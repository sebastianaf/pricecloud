import datetime


def serialize(obj, exclude_keys=None, depth=0, max_depth=3):
    """
    Función para serializar objetos complejos.
    Limita la profundidad de serialización y excluye claves específicas.
    """
    if exclude_keys is None:
        exclude_keys = []

    if depth > max_depth:
        return str(obj)  # Representación simplificada para objetos complejos

    if isinstance(obj, (datetime.datetime, datetime.date, datetime.time)):
        return obj.isoformat()  # Convierte fechas y horas a su representación ISO
    elif isinstance(obj, (str, int, float, bool, type(None))):
        return obj
    elif isinstance(obj, dict):
        return {k: serialize(v, exclude_keys, depth + 1, max_depth) for k, v in obj.items() if k not in exclude_keys}
    elif isinstance(obj, list):
        return [serialize(v, exclude_keys, depth + 1, max_depth) for v in obj]
    else:
        # Convertir objetos complejos a un diccionario de sus atributos públicos no llamables
        return {
            k: serialize(getattr(obj, k), exclude_keys, depth + 1, max_depth)
            for k in dir(obj)
            if not k.startswith('_') and not callable(getattr(obj, k)) and k not in exclude_keys
        }
