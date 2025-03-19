
from getPathFromDrawSvg import getPathFromSVG
from visRoboDH import runPreview


def getPreview(path: str):
    getPathFromSVG(path=path)
    runPreview()