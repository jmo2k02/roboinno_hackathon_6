
from getPathFromDrawSvg import getPathFromSVG
from visRoboDH import sim


def getPreview(path: str, model: str, teachme: bool):
    getPathFromSVG(path=path)
    sim(model=model, teachMe=teachme)