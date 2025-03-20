
from getPathFromDrawSvg import getPathFromSVG
from visRoboDH import runPreview
from visRoboDH_in2dPlain import runPreview_in2dPlain


def getPreview(path: str):
    getPathFromSVG(path=path)
    runPreview()

def getPreviewIn2DPlain(path: str, model_type: str):
    getPathFromSVG(path=path)
    runPreview_in2dPlain(model_key=model_type)