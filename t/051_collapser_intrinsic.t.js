StartTest(function(t) {
    
	t.plan(17)
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS', 'KiokuJS.Backend.Hash', 'KiokuJS.Test.ValueWrapper', 'KiokuJS.Test.TypeMap.ValueWrapper' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,                           "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,                 "'KiokuJS.Collapser' is here")
        t.ok(KiokuJS.Test.ValueWrapper,         "'KiokuJS.Test.ValueWrapper' is here")
        t.ok(KiokuJS.Test.TypeMap.ValueWrapper, "'TKiokuJS.Test.ypeMap.ValueWrapper' is here")

        
        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        
        var value = new KiokuJS.Test.ValueWrapper({ value : 'someValue' })
        
        var array = [ value, value ]
        
        var graph = {
            data1 : value,
            data2 : array
        }
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapser setup')
        
        var backend     = new KiokuJS.Backend.Hash()
        
        var collapser = new KiokuJS.Collapser({
            resolver            : new KiokuJS.Resolver.Standard([
                {
                    meta : 'KiokuJS.Test.TypeMap.ValueWrapper'
                }
            ]),
            backend             : backend
        })
        
        t.ok(collapser, "KiokuJS collapser was instantiated")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph')
        
        var nodes = collapser.collapse({}, [ graph, array ])
        
        t.ok(nodes.length == 2, 'Correct number of nodes is returned')
        
        
        var graphNode   = nodes[0]
        var arrayNode   = nodes[1]

        t.ok(graphNode.object === graph, '`graphNode` has correct object')
        t.ok(arrayNode.object === array, '`arrayNode` has correct object')
        
        t.ok(graphNode.isRoot, '`graphNode` is in the root objects set')
        t.ok(arrayNode.isRoot, '`arrayNode` is in the root objects set')
        
        
        var valueNode1   = graphNode.data.data1
        var valueNode2   = arrayNode.data[0]
        var valueNode3   = arrayNode.data[1]
        
        t.ok(valueNode1 === valueNode2 && valueNode2 === valueNode3, 'All three value nodes are shared')
        
        t.ok(!valueNode1.isFirstClass(), '`valueNode1` is not first class')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking entries')
        
        var graphEntry       = graphNode.getEntry()
        var graphData        = graphEntry.data
        
        t.ok(graphEntry.className == 'Object', 'Entry has correct `className`')
        
        
        var arrayEntry       = arrayNode.getEntry()
        var arrayData        = arrayEntry.data
        
        t.ok(arrayEntry.className == 'Array', 'Entry has correct `className`')

        
        t.ok(graphData.data1 === arrayData[0] && arrayData[0] === arrayData[1], 'Intrinsic entry is shared between entries')
        
        
        var intrinsicEntry = arrayData[1]
        
        t.ok(intrinsicEntry.className == 'KiokuJS.Test.ValueWrapper', 'Entry has correct `className`')
        t.ok(intrinsicEntry.data.value == 'someValue', 'Entry has correct `data`')
        
        
        t.endAsync(async0)
    })
})    