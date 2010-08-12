Role('KiokuJS.Feature.Class.Intrinsic', {
    
    does    : 'KiokuJS.Aspect.AfterCollapse',
    
    
    
    after : {
        
        
        afterCollapse : function (node) {
            node.intrinsic = true
        }
    }
    
})
