PX_PER_MM = 3.779527559


def mm_from_px(px: float) -> float:
    return px / PX_PER_MM


__all__ = ["mm_from_px"]
